--!strict
-- Shared hotbar state (equipped skill + keybind overrides). Used by HUD and SkillController.

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local SkillSettings = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SkillSettings"))

local SkillBarState = {}

SkillBarState._equippedId = "Fireball_Lvl1"
SkillBarState._keybindOverrides = {} :: { [string]: Enum.KeyCode }
SkillBarState._changed = Instance.new("BindableEvent")

export type ChangeKind = "equipped" | "keybind"

function SkillBarState.onChanged(callback: (changeKind: ChangeKind, skillId: string) -> ()): RBXScriptConnection
	return SkillBarState._changed.Event:Connect(callback)
end

local function fireChanged(changeKind: ChangeKind, skillId: string)
	SkillBarState._changed:Fire(changeKind, skillId)
end

function SkillBarState.getEquippedId(): string
	return SkillBarState._equippedId
end

function SkillBarState.setEquipped(skillId: string)
	if not SkillSettings.get(skillId) then
		return
	end
	SkillBarState._equippedId = skillId
	fireChanged("equipped", skillId)
end

function SkillBarState.getKeybind(skillId: string): Enum.KeyCode
	local override = SkillBarState._keybindOverrides[skillId]
	if override then
		return override
	end
	local skill = SkillSettings.get(skillId)
	return if skill then skill.DefaultKeybind else Enum.KeyCode.Unknown
end

function SkillBarState.setKeybind(skillId: string, keyCode: Enum.KeyCode)
	if not SkillSettings.get(skillId) then
		return
	end
	SkillBarState._keybindOverrides[skillId] = keyCode
	fireChanged("keybind", skillId)
end

function SkillBarState.getEquippedKeybind(): Enum.KeyCode
	return SkillBarState.getKeybind(SkillBarState._equippedId)
end

function SkillBarState.keyCodeToLabel(keyCode: Enum.KeyCode): string
	local name = keyCode.Name
	if #name == 1 then
		return name
	end
	if string.sub(name, 1, 5) == "Keypad" then
		return string.sub(name, 6)
	end
	return name
end

return SkillBarState
