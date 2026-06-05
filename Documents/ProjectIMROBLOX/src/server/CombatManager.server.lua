--!strict
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local HttpService = game:GetService("HttpService")

local SkillSettings = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SkillSettings"))
local SkillUnlock = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SkillUnlock"))
local SpellVFX = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellVFX"))
local SpellCooldown = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellCooldown"))
local SpellProjectile = require(script.Parent:WaitForChild("SpellProjectile"))

local CastSkillEvent = ReplicatedStorage:WaitForChild("CastSkill") :: RemoteEvent
local CombatAction = ReplicatedStorage:WaitForChild("CombatAction") :: RemoteEvent
local ChannelSkillEvent = ReplicatedStorage:WaitForChild("ChannelSkill") :: RemoteEvent

type ChannelState = {
	spellId: string,
	startedAt: number,
	releaseToken: string,
}

type WeaponData = { BaseDamage: number, StunDuration: number, StaminaCost: number, MaxCombo: number }
local WEAPONS: { [string]: WeaponData } = {
	["Sword_Grade1"] = { BaseDamage = 100, StunDuration = 1.0, StaminaCost = 12, MaxCombo = 4 },
	["Magic_Staff"] = { BaseDamage = 80, StunDuration = 0.5, StaminaCost = 8, MaxCombo = 3 },
}

local activeChannels: { [Player]: ChannelState } = {}
local lastCastAt: { [Player]: { [string]: number } } = {}
-- Ensures exactly one mana deduction per channel release token (guards duplicate remotes).
local manaSpentForRelease: { [string]: boolean } = {}

-- Instant casts only (channeled spells in SkillSettings use ChannelSkill release for mana).
local LEGACY_INSTANT_SKILL_COSTS: { [string]: number } = {
	["Mana_Burst"] = 75,
	["Grit_Skin"] = 0,
}

local function playerHasSkill(player: Player, skillName: string): boolean
	return SkillUnlock.hasSkill(player, skillName)
end

local function canUseCombat(character: Model): boolean
	if character:GetAttribute("IsStunned") == true then
		return false
	end
	if character:GetAttribute("IsExhausted") == true then
		return false
	end
	return true
end

local function stampCombat(character: Model)
	local timestamp = os.clock()
	character:SetAttribute("LastDamageTime", timestamp)
	character:SetAttribute("LastStaminaSpendTime", timestamp)
end

local function spendActiveMana(character: Model, cost: number): boolean
	local activeMana = character:GetAttribute("ActiveMana") or 0
	if activeMana < cost then
		return false
	end
	character:SetAttribute("ActiveMana", activeMana - cost)
	return true
end

local function isOnCooldown(player: Player, skillId: string, cooldown: number): boolean
	local perPlayer = lastCastAt[player]
	if not perPlayer then
		return false
	end
	local t = perPlayer[skillId]
	if not t then
		return false
	end
	return os.clock() - t < cooldown
end

local function setCooldown(player: Player, skillId: string, cooldownSeconds: number)
	if not lastCastAt[player] then
		lastCastAt[player] = {}
	end
	lastCastAt[player][skillId] = os.clock()

	local character = player.Character
	if character and character.Parent then
		SpellCooldown.apply(character, skillId, cooldownSeconds)
	end
end

local function clearChannel(player: Player, character: Model?)
	activeChannels[player] = nil
	if character and character.Parent then
		character:SetAttribute("IsChannelingSpell", false)
		character:SetAttribute("ChannelingSpellId", nil)
	end
end

local function validateTargetPosition(_character: Model, origin: Vector3, targetPosition: Vector3): Vector3
	local delta = targetPosition - origin
	if delta.Magnitude > 500 then
		return origin + delta.Unit * 500
	end
	return targetPosition
end

-- Flight tween (Exponential-In + FlightDurationScale) is configured in SpellProjectile + SkillSettings.
local function launchSpellProjectile(
	player: Player,
	character: Model,
	spellId: string,
	origin: Vector3,
	targetPosition: Vector3,
	chargeRatio: number
)
	SpellProjectile.launch({
		Player = player,
		Character = character,
		SpellId = spellId,
		Origin = origin,
		TargetPosition = targetPosition,
		ChargeRatio = chargeRatio,
	})
end

ChannelSkillEvent.OnServerEvent:Connect(function(player: Player, payload: any)
	if typeof(payload) ~= "table" then
		return
	end

	local spellId = payload.spellId
	local phase = payload.phase
	if typeof(spellId) ~= "string" or typeof(phase) ~= "string" then
		return
	end

	local skill = SkillSettings.get(spellId)
	if not skill then
		return
	end

	local character = player.Character
	if not character or not character.Parent or not canUseCombat(character) then
		return
	end

	if not playerHasSkill(player, spellId) then
		return
	end

	-- phase == "start": channel only — no mana spend, no projectile.
	if phase == "start" then
		if activeChannels[player] or character:GetAttribute("IsChannelingSpell") == true then
			return
		end
		if isOnCooldown(player, spellId, skill.Cooldown) then
			return
		end
		if (character:GetAttribute("ActiveMana") or 0) < skill.ManaCost then
			return
		end

		activeChannels[player] = {
			spellId = spellId,
			startedAt = os.clock(),
			releaseToken = HttpService:GenerateGUID(false),
		}
		character:SetAttribute("IsChannelingSpell", true)
		character:SetAttribute("ChannelingSpellId", spellId)

		SpellVFX.onChargeBegin(spellId, character, 0)
		return
	end

	if phase == "cancel" then
		SpellVFX.onChargeEnd(spellId, character)
		clearChannel(player, character)
		return
	end

	if phase ~= "release" then
		return
	end

	local channel = activeChannels[player]
	if not channel or channel.spellId ~= spellId then
		return
	end

	-- Server-authoritative charge time; reject sub-MinChargeTime (do not cast at min power)
	local chargeTime = SkillSettings.resolveReleaseChargeTime(channel.startedAt, payload.chargeTime)
	if not SkillSettings.isChargeTimeValid(skill, chargeTime) then
		SpellVFX.onChargeEnd(spellId, character)
		clearChannel(player, character)
		return
	end

	local releaseToken = channel.releaseToken
	clearChannel(player, character)

	-- Mana: exactly once per release, fixed skill.ManaCost (never chargeTime/chargeRatio/impact).
	if manaSpentForRelease[releaseToken] then
		SpellVFX.onChargeEnd(spellId, character)
		return
	end

	if isOnCooldown(player, spellId, skill.Cooldown) then
		SpellVFX.onChargeEnd(spellId, character)
		return
	end

	local manaCost = skill.ManaCost
	manaSpentForRelease[releaseToken] = true
	task.delay(60, function()
		manaSpentForRelease[releaseToken] = nil
	end)

	if not spendActiveMana(character, manaCost) then
		manaSpentForRelease[releaseToken] = nil
		SpellVFX.onChargeEnd(spellId, character)
		return
	end

	SpellVFX.onChargeEnd(spellId, character)
	stampCombat(character)
	setCooldown(player, spellId, skill.Cooldown)

	local chargeRatio = SkillSettings.getChargeRatio(skill, chargeTime)

	local hrp = character:FindFirstChild("HumanoidRootPart") :: BasePart?
	local origin = payload.origin
	if typeof(origin) ~= "Vector3" then
		origin = if hrp then hrp.Position + hrp.CFrame.LookVector * 2 + Vector3.new(0, 1, 0) else character:GetPivot().Position
	end

	local targetPosition = payload.targetPosition
	if typeof(targetPosition) ~= "Vector3" then
		targetPosition = if hrp then origin + hrp.CFrame.LookVector * 50 else origin + Vector3.new(0, 0, -50)
	end
	targetPosition = validateTargetPosition(character, origin, targetPosition)

	launchSpellProjectile(player, character, spellId, origin, targetPosition, chargeRatio)

	print(player.Name .. " cast " .. spellId .. " toward target (charge " .. string.format("%.2f", chargeRatio) .. ")")
end)

CombatAction.OnServerEvent:Connect(function(player: Player, actionType: any)
	if typeof(actionType) ~= "string" then
		return
	end

	local character = player.Character
	if not character or not character.Parent or not canUseCombat(character) then
		return
	end

	local currentStamina = character:GetAttribute("Stamina") or 0
	local activeWeapon = character:GetAttribute("EquippedWeapon") or "Sword_Grade1"
	local weaponStats = WEAPONS[activeWeapon]
	if not weaponStats or currentStamina < weaponStats.StaminaCost then
		return
	end

	if actionType == "M1" then
		local currentCombo = character:GetAttribute("ComboCount") or 0
		local lastAttackTime = character:GetAttribute("LastAttackTime") or 0
		local now = os.clock()

		if now - lastAttackTime > 1.25 or currentCombo >= weaponStats.MaxCombo then
			currentCombo = 1
		else
			currentCombo += 1
		end

		character:SetAttribute("Stamina", currentStamina - weaponStats.StaminaCost)
		character:SetAttribute("ComboCount", currentCombo)
		character:SetAttribute("LastAttackTime", now)
		character:SetAttribute("LastStaminaSpendTime", now)
	end
end)

-- Legacy remote: instant skills only. Channeled spells (in SkillSettings) use ChannelSkill release for mana.
CastSkillEvent.OnServerEvent:Connect(function(player: Player, skillName: any)
	if typeof(skillName) ~= "string" then
		return
	end

	if SkillSettings.get(skillName) then
		return
	end

	local cost = LEGACY_INSTANT_SKILL_COSTS[skillName]
	if cost == nil then
		return
	end

	local character = player.Character
	if not character or not character.Parent or not canUseCombat(character) then
		return
	end

	if not playerHasSkill(player, skillName) then
		return
	end

	if not spendActiveMana(character, cost) then
		return
	end

	stampCombat(character)
end)

local function bindPlayerLifecycle(player: Player)
	local function onCharacterSpawned(character: Model)
		clearChannel(player, character)

		local humanoid = character:FindFirstChildOfClass("Humanoid")
		if not humanoid then
			humanoid = character:WaitForChild("Humanoid", 5) :: Humanoid?
		end
		if humanoid then
			humanoid.Died:Connect(function()
				clearChannel(player, character)
			end)
		end
	end

	player.CharacterRemoving:Connect(function(character)
		clearChannel(player, character)
	end)

	player.CharacterAdded:Connect(onCharacterSpawned)

	if player.Character then
		onCharacterSpawned(player.Character)
	end
end

for _, player in Players:GetPlayers() do
	bindPlayerLifecycle(player)
end
Players.PlayerAdded:Connect(bindPlayerLifecycle)

Players.PlayerRemoving:Connect(function(player)
	activeChannels[player] = nil
	lastCastAt[player] = nil
end)
