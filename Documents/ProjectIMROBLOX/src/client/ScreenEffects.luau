--!strict
--[[
	Anime-style client screen feedback: procedural camera shake, FOV pulses, impact frames.
	Shake is applied in camera-local space and undone each frame so custom cameras / lock-on stay intact.
]]

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

export type ImpactShakeProfile = {
	magnitude: number,
	decay: number,
}

local DEFAULT_FOV = 70
local CHARGE_FOV_BONUS = 8
local RELEASE_SNAP_FOV = 58
local FOV_RECOVER_SPEED = 6
local FOV_CHARGE_SPEED = 5

local CHARGE_SHAKE_BASE = 0.0018
local CHARGE_SHAKE_SCALE = 0.014

local IMPACT_SHAKE_DEFAULT: ImpactShakeProfile = {
	magnitude = 0.085,
	decay = 9,
}

local RENDER_STEP_NAME = "SpellScreenEffects"
local RENDER_PRIORITY = Enum.RenderPriority.Camera.Value + 1

local ScreenEffects = {}

local initialized = false
local renderBound = false

local player: Player
local flashGui: ScreenGui?

local chargeHumActive = false
local chargeRatio = 0

local impactShakeAmount = 0
local impactShakeDecay = IMPACT_SHAKE_DEFAULT.decay

local noiseSeed = math.random() * 1000
local appliedLocalOffset = CFrame.new()
local shakeOffsetActive = false

local fovCurrent = DEFAULT_FOV
local fovRecovering = false

local function getCamera(): Camera?
	return workspace.CurrentCamera
end

local function expLerp(current: number, target: number, speed: number, dt: number): number
	local alpha = 1 - math.exp(-speed * dt)
	return current + (target - current) * alpha
end

local function computeLocalShakeOffset(time: number): CFrame
	local roll = 0
	local pitch = 0
	local yaw = 0

	if chargeHumActive then
		local amp = CHARGE_SHAKE_BASE + chargeRatio * CHARGE_SHAKE_SCALE
		roll += math.noise(noiseSeed, time * 3.5, 0) * amp
		pitch += math.noise(noiseSeed + 17, time * 3.5, 0) * amp
		yaw += math.noise(noiseSeed + 31, time * 3.5, 0) * amp * 0.55
	end

	if impactShakeAmount > 0.0001 then
		local amp = impactShakeAmount
		local freq = 22
		roll += math.noise(noiseSeed + 71, time * freq, 0) * amp
		pitch += math.noise(noiseSeed + 89, time * freq, 0) * amp
		yaw += math.noise(noiseSeed + 103, time * freq, 0) * amp * 0.7
	end

	return CFrame.Angles(roll, pitch, yaw)
end

local function updateFov(dt: number)
	local camera = getCamera()
	if not camera then
		return
	end

	if chargeHumActive then
		fovRecovering = false
		local target = DEFAULT_FOV + chargeRatio * CHARGE_FOV_BONUS
		fovCurrent = expLerp(fovCurrent, target, FOV_CHARGE_SPEED, dt)
	elseif fovRecovering then
		fovCurrent = expLerp(fovCurrent, DEFAULT_FOV, FOV_RECOVER_SPEED, dt)
		if math.abs(fovCurrent - DEFAULT_FOV) < 0.05 then
			fovCurrent = DEFAULT_FOV
			fovRecovering = false
		end
	end

	camera.FieldOfView = fovCurrent
end

local function clearAppliedShake()
	local camera = getCamera()
	if camera then
		camera.CFrame = camera.CFrame * appliedLocalOffset:Inverse()
	end
	appliedLocalOffset = CFrame.new()
	shakeOffsetActive = false
end

local function onRenderStep(dt: number)
	local camera = getCamera()
	if not camera then
		return
	end

	local needsShake = chargeHumActive or impactShakeAmount > 0.0001
	local needsFov = chargeHumActive or fovRecovering

	if not needsShake and not needsFov then
		return
	end

	if needsShake then
		local time = os.clock()
		local newLocalOffset = computeLocalShakeOffset(time)

		-- Relative to current orientation; remove last frame's offset before applying the new one.
		camera.CFrame = camera.CFrame * appliedLocalOffset:Inverse() * newLocalOffset
		appliedLocalOffset = newLocalOffset
		shakeOffsetActive = true

		if impactShakeAmount > 0.0001 then
			impactShakeAmount *= math.exp(-impactShakeDecay * dt)
		else
			impactShakeAmount = 0
		end
	elseif shakeOffsetActive then
		clearAppliedShake()
	end

	if needsFov then
		updateFov(dt)
	end
end

local function ensureFlashGui(): ScreenGui
	if flashGui and flashGui.Parent then
		return flashGui
	end

	local playerGui = player:WaitForChild("PlayerGui")
	local gui = Instance.new("ScreenGui")
	gui.Name = "SpellScreenEffects"
	gui.IgnoreGuiInset = true
	gui.DisplayOrder = 999
	gui.ResetOnSpawn = false
	gui.Parent = playerGui
	flashGui = gui
	return gui
end

function ScreenEffects.init()
	if initialized then
		return
	end
	initialized = true

	player = Players.LocalPlayer
	if not player then
		player = Players.PlayerAdded:Wait()
	end

	fovCurrent = DEFAULT_FOV
	local camera = getCamera()
	if camera then
		fovCurrent = camera.FieldOfView
	end

	if not renderBound then
		renderBound = true
		RunService:BindToRenderStep(RENDER_STEP_NAME, RENDER_PRIORITY, onRenderStep)
	end
end

function ScreenEffects.start()
	ScreenEffects.init()
end

function ScreenEffects.destroy()
	if renderBound then
		RunService:UnbindFromRenderStep(RENDER_STEP_NAME)
		renderBound = false
	end
	clearAppliedShake()
	if flashGui then
		flashGui:Destroy()
		flashGui = nil
	end
	initialized = false
	chargeHumActive = false
	impactShakeAmount = 0
end

-- Low hum while holding charge; call every frame with 0..1 charge ratio.
function ScreenEffects.setChargeRatio(ratio: number)
	ScreenEffects.init()
	chargeHumActive = true
	chargeRatio = math.clamp(ratio, 0, 1)
end

function ScreenEffects.stopChargeHum()
	chargeHumActive = false
	chargeRatio = 0
	fovRecovering = true
end

-- FOV snaps inward on successful cast release, then eases back to default.
function ScreenEffects.onCastRelease()
	ScreenEffects.init()
	chargeHumActive = false
	chargeRatio = 0

	local camera = getCamera()
	if camera then
		fovCurrent = RELEASE_SNAP_FOV
		camera.FieldOfView = fovCurrent
	end
	fovRecovering = true
end

function ScreenEffects.onImpact(profile: ImpactShakeProfile?)
	ScreenEffects.init()
	local p = profile or IMPACT_SHAKE_DEFAULT
	impactShakeAmount = math.max(impactShakeAmount, p.magnitude)
	impactShakeDecay = p.decay
end

-- Exactly two RenderStepped frames of full-screen white.
function ScreenEffects.playImpactFlash()
	ScreenEffects.init()
	task.spawn(function()
		local gui = ensureFlashGui()
		local frame = Instance.new("Frame")
		frame.Name = "ImpactFlash"
		frame.Size = UDim2.fromScale(1, 1)
		frame.Position = UDim2.fromScale(0, 0)
		frame.BackgroundColor3 = Color3.new(1, 1, 1)
		frame.BackgroundTransparency = 0
		frame.BorderSizePixel = 0
		frame.ZIndex = 1000
		frame.Parent = gui

		RunService.RenderStepped:Wait()
		RunService.RenderStepped:Wait()

		frame:Destroy()
	end)
end

return ScreenEffects
