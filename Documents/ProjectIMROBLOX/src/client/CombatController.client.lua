local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ContextActionService = game:GetService("ContextActionService")

local LockOnTarget = require(script.Parent:WaitForChild("LockOnTarget"))
local SkillInputState = require(script.Parent:WaitForChild("SkillInputState"))

local CombatAction = ReplicatedStorage:WaitForChild("CombatAction")

local AnimationController: { Play: (string) -> () }? = nil
do
	local animModule = ReplicatedStorage:FindFirstChild("AnimationController")
	if animModule and animModule:IsA("ModuleScript") then
		AnimationController = require(animModule)
	else
		warn("[CombatController] ReplicatedStorage.AnimationController not found — M1 will skip animations")
	end
end

local player = Players.LocalPlayer
local camera = workspace.CurrentCamera

local lockedTarget = nil

-- Visual Debugging Folder
local debugFolder = workspace:FindFirstChild("CombatDebug")
if not debugFolder then
	debugFolder = Instance.new("Folder")
	debugFolder.Name = "CombatDebug"
	debugFolder.Parent = workspace
end

local function drawDebugLine(path, color)
	local part = Instance.new("Part")
	part.Name = "DebugLine"
	part.Anchored = true
	part.CanCollide = false
	part.CanTouch = false
	part.CastShadow = false
	part.Color = color
	part.Material = Enum.Material.Neon
	part.Transparency = 0.5
	
	local startPos = path[1]
	local endPos = path[2]
	local dist = (endPos - startPos).Magnitude
	
	part.Size = Vector3.new(0.1, 0.1, dist)
	part.CFrame = CFrame.lookAt(startPos:Lerp(endPos, 0.5), endPos)
	part.Parent = debugFolder
	
	task.delay(1, function()
		if part and part.Parent then part:Destroy() end
	end)
end

local function getChar()
	local char = player.Character
	if not char then return end
	local hum = char:FindFirstChildOfClass("Humanoid")
	local hrp = char:FindFirstChild("HumanoidRootPart")
	if not hum or not hrp then return end
	return char, hum, hrp
end

local function isFacing(targetPos)
	local char, hum, hrp = getChar()
	if not hrp then return false end
	
	local toTarget = (targetPos - camera.CFrame.Position).Unit
	local look = camera.CFrame.LookVector
	local dot = look:Dot(toTarget)
	
	-- 60 degree cone = cos(30) approx 0.866
	local success = dot > 0.866
	
	-- Visual Debugging for Vision Cone
	drawDebugLine({camera.CFrame.Position, targetPos}, success and Color3.new(0, 1, 0) or Color3.new(1, 0, 0))
	
	return success
end

local function findTarget()
	local char, hum, hrp = getChar()
	if not hrp then return end
	
	local closest = nil
	local minDist = 45
	
	-- Optimization: Ensure we look for HumanoidRootPart directly within workspace Models 
	-- while ignoring the local player's own character.
	for _, obj in workspace:GetChildren() do
		if obj:IsA("Model") and obj ~= char then
			local targetHum = obj:FindFirstChildOfClass("Humanoid")
			local targetHrp = obj:FindFirstChild("HumanoidRootPart")
			
			if targetHum and targetHum.Health > 0 and targetHrp then
				local dist = (hrp.Position - targetHrp.Position).Magnitude
				if dist < minDist and isFacing(targetHrp.Position) then
					minDist = dist
					closest = obj
				end
			end
		end
	end
	
	return closest
end

local function toggleLock()
	local char = player.Character
	if not char then return end

	if lockedTarget then
		lockedTarget = nil
	else
		lockedTarget = findTarget()
	end

	LockOnTarget.setTarget(lockedTarget)
	char:SetAttribute("LockedTarget", lockedTarget and lockedTarget.Name or nil)
end

local function getOrCreateAttachment(parent, name)
	local attachment = parent:FindFirstChild(name)
	if attachment and attachment:IsA("Attachment") then
		return attachment
	end
	attachment = Instance.new("Attachment")
	attachment.Name = name
	attachment.Parent = parent
	return attachment
end

local function executeM1()
	local char, hum, hrp = getChar()
	if not hum or not hrp then return end

	if hum.FloorMaterial == Enum.Material.Air then return end
	if char:GetAttribute("IsExhausted") == true then return end
	if SkillInputState.isCharging then return end

	-- M1 = melee only. Spells use the hotbar keyboard key (SkillController).
	local playerClass = char:GetAttribute("Class") or "Warrior"

	local animationMap = {
		["Warrior"] = "Sword Attack Animation",
		["Mage"] = "Sword Attack Animation",
		["Sorcerer"] = "Sword Attack Animation",
		["Berserker"] = "Punching Animation",
	}

	local animName = animationMap[playerClass] or "Sword Attack Animation"
	if AnimationController then
		AnimationController.Play(animName)
	end
	
	print("[CombatController] M1 Executed for Class: " .. playerClass .. " with Animation: " .. animName)

	CombatAction:FireServer("M1")

	-- Disable AutoRotate during swing
	hum.AutoRotate = false
	task.delay(0.4, function()
		if hum and hum.Parent then
			hum.AutoRotate = true
		end
	end)

	-- Lunge Velocity Core
	local lungeDir = hrp.CFrame.LookVector
	if lockedTarget and lockedTarget:FindFirstChild("HumanoidRootPart") then
		local targetHrp = lockedTarget.HumanoidRootPart
		lungeDir = (Vector3.new(targetHrp.Position.X, hrp.Position.Y, targetHrp.Position.Z) - hrp.Position).Unit
	end

	local attachment = getOrCreateAttachment(hrp, "AttackLungeAttachment")
	local velocity = Instance.new("LinearVelocity")
	velocity.Name = "AttackLungeVelocity"
	velocity.Attachment0 = attachment
	velocity.RelativeTo = Enum.ActuatorRelativeTo.World
	velocity.VectorVelocity = lungeDir * 45
	velocity.MaxForce = 20000 * hrp.AssemblyMass
	velocity.Parent = hrp

	task.delay(0.08, function()
		if velocity and velocity.Parent then
			velocity:Destroy()
		end
	end)
end

-- Input handling: sink only when we actually handle the action
local function handleAction(actionName, inputState, _inputObject)
	if inputState ~= Enum.UserInputState.Begin then
		return Enum.ContextActionResult.Pass
	end
	if actionName == "CombatLock" then
		toggleLock()
		return Enum.ContextActionResult.Sink
	elseif actionName == "CombatM1" then
		executeM1()
		return Enum.ContextActionResult.Sink
	end
	return Enum.ContextActionResult.Pass
end

-- Lock-on: F | M1: mouse only (spells use hotbar key via SkillController)
ContextActionService:BindActionAtPriority("CombatLock", handleAction, false, 2000, Enum.KeyCode.F)
ContextActionService:BindActionAtPriority("CombatM1", handleAction, false, 2000, Enum.UserInputType.MouseButton1)

-- Main Loop
RunService.RenderStepped:Connect(function(dt)
	local char, hum, hrp = getChar()
	if not hum or not hrp then return end
	
	if lockedTarget and lockedTarget.Parent then
		local targetHum = lockedTarget:FindFirstChildOfClass("Humanoid")
		local targetHrp = lockedTarget:FindFirstChild("HumanoidRootPart")
		
		if targetHum and targetHum.Health > 0 and targetHrp then
			-- Force MouseLock behavior
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter
			
			-- Orientation Interpolation
			local targetPos = Vector3.new(targetHrp.Position.X, hrp.Position.Y, targetHrp.Position.Z)
			local lookCF = CFrame.lookAt(hrp.Position, targetPos)
			hrp.CFrame = hrp.CFrame:Lerp(lookCF, 0.2)
			
			-- Requirement: Update character Model's local attribute
			char:SetAttribute("LockedTarget", lockedTarget.Name)
		else
			lockedTarget = nil
			LockOnTarget.setTarget(nil)
			char:SetAttribute("LockedTarget", nil)
		end
	else
		-- Reset if no target
		if UserInputService.MouseBehavior == Enum.MouseBehavior.LockCenter and not char:GetAttribute("LockedTarget") then
			-- Only reset if we aren't using ShiftLock (which also sets LockCenter)
			-- But the prompt implies we want interpolation to handle it when locked.
		end
	end
end)
