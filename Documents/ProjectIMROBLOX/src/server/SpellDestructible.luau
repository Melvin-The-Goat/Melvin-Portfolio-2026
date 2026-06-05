--!strict
-- Server: dynamic durability via CurrentHardness (falls back to Hardness).

local Debris = game:GetService("Debris")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local SkillSettings = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SkillSettings"))

local SpellDestructible = {}

local function readCurrentHardness(hitPart: BasePart): number?
	local current = hitPart:GetAttribute("CurrentHardness")
	if typeof(current) == "number" then
		return current
	end

	local maxHardness = hitPart:GetAttribute("Hardness")
	if typeof(maxHardness) == "number" then
		hitPart:SetAttribute("CurrentHardness", maxHardness)
		return maxHardness
	end

	return nil
end

local function applyBreakImpulse(hitPart: BasePart, impactPosition: Vector3, blowImpulse: number)
	hitPart.Anchored = false
	if hitPart.Material == Enum.Material.Grass or hitPart.Material == Enum.Material.Ground then
		hitPart.Material = Enum.Material.Rock
	else
		hitPart.Material = Enum.Material.CrackedLava
	end

	local offset = hitPart.Position - impactPosition
	local direction = if offset.Magnitude > 0.05 then offset.Unit else Vector3.new(0, 1, 0)

	local mass = hitPart.AssemblyMass
	if mass < 0.01 then
		mass = hitPart:GetMass()
	end

	task.defer(function()
		if hitPart.Parent then
			hitPart:ApplyImpulse(direction * mass * blowImpulse)
		end
	end)
end

-- Returns true only when the part was destroyed this hit (hardness depleted).
function SpellDestructible.tryBreakPart(
	hitPart: BasePart,
	spellDamage: number,
	impactPosition: Vector3,
	spellId: string
): boolean
	local hardness = readCurrentHardness(hitPart)
	if hardness == nil then
		return false
	end

	if not hitPart.Anchored then
		return false
	end

	local newHardness = hardness - spellDamage
	hitPart:SetAttribute("CurrentHardness", newHardness)

	if newHardness > 0 then
		return false
	end

	local skill = SkillSettings.get(spellId)
	local blowImpulse = if skill then skill.Destruction.BlowAwayImpulse else 12000
	local cleanupSeconds = if skill then skill.Destruction.PartCleanupSeconds else 3

	applyBreakImpulse(hitPart, impactPosition, blowImpulse)
	Debris:AddItem(hitPart, cleanupSeconds)
	return true
end

return SpellDestructible
