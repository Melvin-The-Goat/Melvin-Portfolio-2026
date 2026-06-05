--!strict
-- Server fireball: visible Neon ball, accelerating tween, single-hit resolution.

local Debris = game:GetService("Debris")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local SkillSettings = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SkillSettings"))
local SpellVFX = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellVFX"))
local SpellImpactResolve = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellImpactResolve"))
local SpellDestructible = require(script.Parent:WaitForChild("SpellDestructible"))

export type LaunchParams = {
	Player: Player,
	Character: Model,
	SpellId: string,
	Origin: Vector3,
	TargetPosition: Vector3,
	ChargeRatio: number,
}

local SpellProjectile = {}

local function buildRaycastParams(character: Model, projectile: BasePart): RaycastParams
	local params = RaycastParams.new()
	params.FilterType = Enum.RaycastFilterType.Exclude
	params.FilterDescendantsInstances = { character, projectile }
	return params
end

function SpellProjectile.launch(params: LaunchParams)
	local skill = SkillSettings.get(params.SpellId)
	if not skill then
		return
	end

	local aimDelta = params.TargetPosition - params.Origin
	local direction = if aimDelta.Magnitude < 0.01 then params.Character:GetPivot().LookVector else aimDelta.Unit

	local damage = SkillSettings.scaleDamage(skill, params.ChargeRatio)
	local size = SkillSettings.scaleSize(skill, params.ChargeRatio)
	local maxDistance = SkillSettings.getMaxTravelDistance(skill)
	local speed = skill.Travel.Speed

	local travelDistance = math.min(aimDelta.Magnitude, maxDistance)
	if travelDistance < 0.05 then
		travelDistance = math.min(maxDistance, 50)
	end

	local endPosition = params.Origin + direction * travelDistance

	-- Anime snap-acceleration: shorter timeline + Exponential-In concentrates speed at the end.
	local linearDuration = if speed > 0 then travelDistance / speed else skill.Travel.MaxLifetime
	local durationScale = skill.Travel.FlightDurationScale
	local duration = linearDuration * durationScale
	duration = math.min(duration, skill.Travel.MaxLifetime * 0.9)
	duration = math.max(duration, 0.06)

	local projectile = Instance.new("Part")
	projectile.Name = skill.DisplayName .. "_Projectile"
	projectile.Shape = Enum.PartType.Ball
	projectile.Size = size
	projectile.Color = skill.Color
	projectile.Material = Enum.Material.Neon
	projectile.CanCollide = false
	projectile.CanQuery = true
	projectile.CanTouch = true
	projectile.Anchored = true
	projectile.CFrame = CFrame.new(params.Origin)
	projectile.Parent = workspace

	local rayParams = buildRaycastParams(params.Character, projectile)
	local radius = math.max(size.X, size.Y, size.Z) * 0.5

	SpellVFX.onFlightBegin(params.SpellId, projectile)

	local resolved = false
	local activeTween: Tween? = nil
	local touchConnection: RBXScriptConnection? = nil
	local sweepConnection: RBXScriptConnection? = nil
	local lastSweepPos = params.Origin

	local function disconnectProjectileListeners()
		if touchConnection then
			touchConnection:Disconnect()
			touchConnection = nil
		end
		if sweepConnection and sweepConnection.Connected then
			sweepConnection:Disconnect()
			sweepConnection = nil
		end
	end

	local function buildContext(hitPart: BasePart?, hitPosition: Vector3): SpellImpactResolve.ImpactContext
		local hitModel = if hitPart then hitPart:FindFirstAncestorOfClass("Model") else nil
		local humanoid = if hitModel then hitModel:FindFirstChildOfClass("Humanoid") else nil
		local isEntity = SpellImpactResolve.isDamageableEntity(hitModel, params.Character, humanoid)

		return {
			SpellId = params.SpellId,
			Position = hitPosition,
			HitPart = hitPart,
			HitModel = hitModel,
			IsEntity = isEntity,
			Damage = damage,
			CasterCharacter = params.Character,
		}
	end

	local function resolveImpact(hitPart: BasePart?, hitPosition: Vector3)
		if resolved then
			return
		end
		resolved = true

		disconnectProjectileListeners()

		if activeTween then
			activeTween:Cancel()
			activeTween = nil
		end

		local ctx = buildContext(hitPart, hitPosition)

		SpellImpactResolve.resolve(
			ctx,
			function(part, dmg, pos, spellId)
				SpellDestructible.tryBreakPart(part, dmg, pos, spellId)
			end,
			function(impactCtx)
				SpellVFX.onEntityImpact(impactCtx)
			end,
			function(impactCtx)
				SpellVFX.onWorldImpact(impactCtx)
			end,
			function(spellId, pos)
				SpellVFX.onDissipate(spellId, pos)
			end
		)

		SpellVFX.cleanupProjectile(projectile)
		projectile:Destroy()
	end

	touchConnection = projectile.Touched:Connect(function(hit)
		if resolved then
			return
		end
		if hit:IsDescendantOf(params.Character) then
			return
		end
		if not hit:IsA("BasePart") then
			return
		end

		resolveImpact(hit, projectile.Position)
	end)

	sweepConnection = RunService.Heartbeat:Connect(function()
		if resolved or not projectile.Parent then
			disconnectProjectileListeners()
			return
		end

		local currentPos = projectile.Position
		local sweep = currentPos - lastSweepPos
		if sweep.Magnitude > 0.001 then
			local hitResult = workspace:Spherecast(lastSweepPos, radius, sweep, rayParams)
			if hitResult and hitResult.Instance:IsA("BasePart") then
				local impactPos = hitResult.Position + hitResult.Normal * 0.35
				projectile.CFrame = CFrame.new(impactPos)
				resolveImpact(hitResult.Instance, impactPos)
				return
			end
		end
		lastSweepPos = currentPos
	end)

	local tweenInfo = TweenInfo.new(duration, Enum.EasingStyle.Exponential, Enum.EasingDirection.In)
	activeTween = TweenService:Create(projectile, tweenInfo, {
		CFrame = CFrame.new(endPosition),
	})
	activeTween:Play()

	activeTween.Completed:Connect(function(playbackState)
		if resolved then
			return
		end
		disconnectProjectileListeners()
		if playbackState == Enum.PlaybackState.Completed then
			resolveImpact(nil, projectile.Position)
		end
	end)

	Debris:AddItem(projectile, duration + 2)
end

return SpellProjectile
