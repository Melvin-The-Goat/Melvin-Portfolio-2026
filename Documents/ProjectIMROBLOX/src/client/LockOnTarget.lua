--!strict
-- Shared lock-on state for CombatController (writer) and SkillController (reader).

local LockOnTarget = {}

LockOnTarget._targetModel = nil :: Model?

function LockOnTarget.setTarget(model: Model?)
	LockOnTarget._targetModel = model
end

function LockOnTarget.getTarget(): Model?
	local model = LockOnTarget._targetModel
	if model and model.Parent then
		local hum = model:FindFirstChildOfClass("Humanoid")
		local hrp = model:FindFirstChild("HumanoidRootPart")
		if hum and hum.Health > 0 and hrp then
			return model
		end
	end
	LockOnTarget._targetModel = nil
	return nil
end

function LockOnTarget.getTargetPosition(): Vector3?
	local model = LockOnTarget.getTarget()
	if not model then
		return nil
	end
	local hrp = model:FindFirstChild("HumanoidRootPart") :: BasePart?
	return if hrp then hrp.Position else nil
end

return LockOnTarget
