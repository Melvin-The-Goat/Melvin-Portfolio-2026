--!strict
-- Initializes player/character attributes and shared remotes.
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local HttpService = game:GetService("HttpService")

local SkillUnlock = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SkillUnlock"))

local function ensureRemote(name: string): RemoteEvent
	local existing = ReplicatedStorage:FindFirstChild(name)
	if existing and existing:IsA("RemoteEvent") then
		return existing
	end
	local remote = Instance.new("RemoteEvent")
	remote.Name = name
	remote.Parent = ReplicatedStorage
	return remote
end

local function applyCharacterDefaults(character: Model)
	character:SetAttribute("Health", 100)
	character:SetAttribute("MaxHealth", 100)
	character:SetAttribute("Stamina", 100)
	character:SetAttribute("MaxStamina", 100)
	character:SetAttribute("ActiveMana", 100)
	character:SetAttribute("MaxActiveMana", 100)
	character:SetAttribute("ManaReserve", 100)
	character:SetAttribute("MaxManaReserve", 100)
	character:SetAttribute("ComboCount", 0)
	character:SetAttribute("IsStunned", false)
	character:SetAttribute("IsExhausted", false)
	character:SetAttribute("IsChargingMana", false)
	character:SetAttribute("IsChannelingSpell", false)
	character:SetAttribute("ChannelingSpellId", nil)
	character:SetAttribute("EquippedWeapon", "Magic_Staff")
	character:SetAttribute("Class", "Mage")
end

local function onPlayerAdded(player: Player)
	SkillUnlock.ensurePlayerDefaults(player)

	player:GetAttributeChangedSignal("UnlockedSkills"):Connect(function()
		SkillUnlock.ensurePlayerDefaults(player)
	end)

	local function onCharacterAdded(character: Model)
		applyCharacterDefaults(character)
	end

	if player.Character then
		onCharacterAdded(player.Character)
	end
	player.CharacterAdded:Connect(onCharacterAdded)
end

local StatManager = {}

function StatManager.init()
	if StatManager._initialized then
		return
	end
	StatManager._initialized = true

	ensureRemote("CastSkill")
	ensureRemote("CombatAction")
	ensureRemote("ChannelSkill")
	ensureRemote("ToggleManaCharge")
	ensureRemote("SpellImpactFX")

	for _, player in Players:GetPlayers() do
		onPlayerAdded(player)
	end
	Players.PlayerAdded:Connect(onPlayerAdded)
end

StatManager.init()

return StatManager
