--!strict
-- Spell casting: hold the equipped hotbar key (default E), release to fire. Not mouse click.

local SkillControllerApp = {}

function SkillControllerApp.start()
	print("[SkillController] Starting...")

local ContextActionService = game:GetService("ContextActionService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
if not player then
	player = Players.PlayerAdded:Wait()
end

local parent = script.Parent
local shared = ReplicatedStorage:WaitForChild("Shared")
local SkillSettings = require(shared:WaitForChild("SkillSettings"))
local SkillBarState = require(shared:WaitForChild("SkillBarState"))
local SpellCooldown = require(shared:WaitForChild("SpellCooldown"))
local SkillUnlock = require(shared:WaitForChild("SkillUnlock"))
local LockOnTarget = require(parent:WaitForChild("LockOnTarget"))
local SkillInputState = require(parent:WaitForChild("SkillInputState"))
local ScreenEffects = require(parent:WaitForChild("ScreenEffects"))

local SpellVFXClient: any
do
	local ok, mod = pcall(function()
		return require(parent:WaitForChild("SpellVFXClient"))
	end)
	if ok then
		SpellVFXClient = mod
	else
		warn("[SkillController] SpellVFXClient failed:", mod)
		SpellVFXClient = {
			onChargeBegin = function() end,
			onChargeUpdate = function() end,
			onChargeEnd = function() end,
		}
	end
end

local channelRemote = ReplicatedStorage:WaitForChild("ChannelSkill")
if not channelRemote:IsA("RemoteEvent") then
	error("[SkillController] ChannelSkill must be a RemoteEvent — is StatManager running on the server?")
end
local ChannelSkillEvent = channelRemote :: RemoteEvent

local camera = workspace.CurrentCamera

local charging = false
local chargeStartedAt = 0
local activeSpellId: string? = nil

local SPELL_ACTION = "SpellCastChannel"
local SPELL_BIND_PRIORITY = 3000

local function isSkillUnlocked(skillId: string): boolean
	return SkillUnlock.hasSkill(player, skillId)
end

local function getCastOrigin(character: Model): Vector3
	local hand = character:FindFirstChild("RightHand") :: BasePart?
	if hand then
		return hand.Position
	end
	return character:GetPivot().Position + Vector3.new(0, 1.5, 0)
end

local function getMouseWorldPosition(): Vector3
	if not camera then
		camera = workspace.CurrentCamera
	end
	if not camera then
		return Vector3.zero
	end

	local mouseLocation = UserInputService:GetMouseLocation()
	local ray = camera:ViewportPointToRay(mouseLocation.X, mouseLocation.Y)
	local params = RaycastParams.new()
	params.FilterType = Enum.RaycastFilterType.Exclude
	local char = player.Character
	if char then
		params.FilterDescendantsInstances = { char }
	end

	local result = workspace:Raycast(ray.Origin, ray.Direction * 1000, params)
	if result then
		return result.Position
	end
	return ray.Origin + ray.Direction * 200
end

local function getTargetPosition(_character: Model): Vector3
	local lockPos = LockOnTarget.getTargetPosition()
	if lockPos then
		return lockPos
	end
	return getMouseWorldPosition()
end

local function getEquippedSkill(): SkillSettings.SkillDefinition?
	return SkillSettings.get(SkillBarState.getEquippedId())
end

local function setChargingState(active: boolean)
	charging = active
	SkillInputState.isCharging = active
end

local function cancelCharge()
	if not charging or not activeSpellId then
		return
	end
	local spellId = activeSpellId
	setChargingState(false)
	activeSpellId = nil

	local character = player.Character
	if character then
		SpellVFXClient.onChargeEnd(spellId, character)
	end

	ScreenEffects.stopChargeHum()

	ChannelSkillEvent:FireServer({
		spellId = spellId,
		phase = "cancel",
	})
	print("[SkillController] Charge cancelled:", spellId)
end

local function beginCharge()
	if charging then
		return
	end

	local skill = getEquippedSkill()
	if not skill then
		warn("[SkillController] No equipped skill in hotbar")
		return
	end

	if not isSkillUnlocked(skill.Id) then
		warn("[SkillController] Skill not unlocked:", skill.Id, "| unlocked:", table.concat(SkillUnlock.getList(player), ", "))
		return
	end

	local character = player.Character
	if not character then
		warn("[SkillController] No character for cast")
		return
	end

	if SpellCooldown.isActive(character, skill.Id) then
		print("[SkillController] On cooldown:", skill.DisplayName, string.format("(%.1fs left)", SpellCooldown.getRemaining(character, skill.Id)))
		return
	end

	if (character:GetAttribute("ActiveMana") or 0) < skill.ManaCost then
		warn("[SkillController] Not enough mana for", skill.DisplayName)
		return
	end

	activeSpellId = skill.Id
	chargeStartedAt = os.clock()
	setChargingState(true)

	ScreenEffects.setChargeRatio(0)
	SpellVFXClient.onChargeBegin(skill.Id, character)

	ChannelSkillEvent:FireServer({
		spellId = skill.Id,
		phase = "start",
	})

	print("[SkillController] Charging", skill.DisplayName, "| release key to cast")
end

local function releaseCharge()
	if not charging or not activeSpellId then
		return
	end

	local spellId = activeSpellId
	local skill = SkillSettings.get(spellId)
	if not skill then
		cancelCharge()
		return
	end

	local character = player.Character
	if not character then
		cancelCharge()
		return
	end

	local chargeTime = os.clock() - chargeStartedAt
	setChargingState(false)
	activeSpellId = nil

	SpellVFXClient.onChargeEnd(spellId, character)

	if chargeTime < skill.MinChargeTime then
		ScreenEffects.stopChargeHum()
		ChannelSkillEvent:FireServer({ spellId = spellId, phase = "cancel" })
		print("[SkillController] Released too early (", string.format("%.2f", chargeTime), "s )")
		return
	end

	ScreenEffects.onCastRelease()

	local origin = getCastOrigin(character)
	local targetPosition = getTargetPosition(character)

	ChannelSkillEvent:FireServer({
		spellId = spellId,
		phase = "release",
		chargeTime = chargeTime,
		origin = origin,
		targetPosition = targetPosition,
	})

	print("[SkillController] Cast", skill.DisplayName, "-> server (charge", string.format("%.2f", chargeTime), "s)")
end

local function onSpellAction(_actionName: string, inputState: Enum.UserInputState, _inputObject: InputObject)
	if inputState == Enum.UserInputState.Begin then
		local skill = getEquippedSkill()
		if not skill or not isSkillUnlocked(skill.Id) then
			return Enum.ContextActionResult.Pass
		end
		beginCharge()
		return Enum.ContextActionResult.Sink
	elseif inputState == Enum.UserInputState.End then
		if not charging then
			return Enum.ContextActionResult.Pass
		end
		releaseCharge()
		return Enum.ContextActionResult.Sink
	end
	return Enum.ContextActionResult.Pass
end

local function bindSpellCastKey()
	ContextActionService:UnbindAction(SPELL_ACTION)
	local keyCode = SkillBarState.getEquippedKeybind()
	ContextActionService:BindActionAtPriority(
		SPELL_ACTION,
		onSpellAction,
		false,
		SPELL_BIND_PRIORITY,
		keyCode
	)
	print("[SkillController] Bound spell cast to key:", keyCode.Name)
end

SkillBarState.onChanged(function(changeKind, skillId)
	bindSpellCastKey()
	print("[SkillController] Hotbar updated:", changeKind, skillId)
end)

bindSpellCastKey()

SkillUnlock.ensurePlayerDefaults(player)
player:GetAttributeChangedSignal("UnlockedSkills"):Connect(function()
	SkillUnlock.ensurePlayerDefaults(player)
end)

RunService.RenderStepped:Connect(function()
	if not charging or not activeSpellId then
		return
	end
	local skill = SkillSettings.get(activeSpellId)
	local character = player.Character
	if not skill or not character then
		return
	end
	local ratio = SkillSettings.getChargeRatio(skill, os.clock() - chargeStartedAt)
	ScreenEffects.setChargeRatio(ratio)
	SpellVFXClient.onChargeUpdate(activeSpellId, character, ratio)
end)

player.CharacterRemoving:Connect(function()
	ScreenEffects.stopChargeHum()
	SpellVFXClient.clearAllChargeVFX()
	cancelCharge()
end)

print("[SkillController] Ready — hold hotbar key (default E), release to cast")

end

return SkillControllerApp
