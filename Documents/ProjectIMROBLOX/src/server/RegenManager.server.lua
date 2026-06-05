--!strict
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Configuration from your Design Document
local STAMINA_REGEN_PER_SEC = 15
local REGEN_DELAY = 2.0
local OUT_OF_COMBAT_TIME = 35.0
local EXHAUSTION_RECOVERY_THRESHOLD = 30

-- Mana Configuration (Section 11 Adaptations)
local MANA_TRANSFER_RATE = 75           -- How fast Bar 1 pours into Bar 2 per second
local PASSIVE_REGEN_OUT_OF_COMBAT = 50  -- Natural passive recovery for Bar 1

-- New Manual Charging Speeds
local CHARGE_RATE_OUT_OF_COMBAT = 120   -- High-speed manual focus charging
local CHARGE_RATE_IN_COMBAT = 25        -- Heavily reduced combat efficiency state

-- Process regeneration and mana piping calculations for a single character
local function processCharacterRegen(character: Model, dt: number)
	-- Fetch current resource values safely
	local stamina = character:GetAttribute("Stamina")
	local maxStamina = character:GetAttribute("MaxStamina")

	local activeMana = character:GetAttribute("ActiveMana")
	local maxActiveMana = character:GetAttribute("MaxActiveMana")
	local manaReserve = character:GetAttribute("ManaReserve")
	local maxManaReserve = character:GetAttribute("MaxManaReserve")

	if not stamina or not maxStamina or not activeMana or not manaReserve then return end

	local currentTime = os.clock()
	local lastDamage = character:GetAttribute("LastDamageTime") or 0
	local lastStaminaSpend = character:GetAttribute("LastStaminaSpendTime") or 0
	local isExhausted = character:GetAttribute("IsExhausted") or false
	local isCharging = character:GetAttribute("IsChargingMana") or false

	local timeSinceDamage = currentTime - lastDamage
	local timeSinceSpend = currentTime - lastStaminaSpend
	local inCombat = timeSinceDamage < OUT_OF_COMBAT_TIME

	---------------------------------------------------------
	-- STAMINA REGEN & EXHAUSTION LOGIC
	---------------------------------------------------------
	if timeSinceDamage >= REGEN_DELAY and timeSinceSpend >= REGEN_DELAY then
		if stamina < maxStamina then
			stamina = math.min(maxStamina, stamina + (STAMINA_REGEN_PER_SEC * dt))
		end
	end

	if not isExhausted and stamina <= 0 then
		character:SetAttribute("IsExhausted", true)
		isExhausted = true
	elseif isExhausted and stamina >= EXHAUSTION_RECOVERY_THRESHOLD then
		-- Fixed typo syntax error here
		character:SetAttribute("IsExhausted", false)
		isExhausted = false
	end

	---------------------------------------------------------
	-- DUAL MANA SYSTEM LOGIC
	---------------------------------------------------------
	-- 1. Bar 2 Refill Logic: Pull from Bar 1 (Reserve) into Bar 2 (Active)
	if activeMana < maxActiveMana and manaReserve > 0 then
		local needed = maxActiveMana - activeMana
		local transferAmount = math.min(needed, MANA_TRANSFER_RATE * dt)
		transferAmount = math.min(transferAmount, manaReserve)

		activeMana = activeMana + transferAmount
		manaReserve = manaReserve - transferAmount
	end

	-- 2. Bar 1 Replenish Logic: Passive + Manual Dynamic Charging
	local reserveRegenVelocity = 0

	-- Apply passive out-of-combat flow
	if not inCombat then
		reserveRegenVelocity += PASSIVE_REGEN_OUT_OF_COMBAT
	end

	-- Layer manual charging on top based on current combat pacing
	if isCharging then
		if inCombat then
			reserveRegenVelocity += CHARGE_RATE_IN_COMBAT
		else
			reserveRegenVelocity += CHARGE_RATE_OUT_OF_COMBAT
		end
	end

	-- Execute calculated resource pool additions
	if reserveRegenVelocity > 0 and manaReserve < maxManaReserve then
		manaReserve = math.min(maxManaReserve, manaReserve + (reserveRegenVelocity * dt))
	end

	---------------------------------------------------------
	-- STATE SYNCHRONIZATION
	---------------------------------------------------------
	if character:GetAttribute("InCombat") ~= inCombat then
		character:SetAttribute("InCombat", inCombat)
	end

	character:SetAttribute("Stamina", stamina)
	character:SetAttribute("ActiveMana", activeMana)
	character:SetAttribute("ManaReserve", manaReserve)
end

-- Central loop running every single frame on the server
RunService.Heartbeat:Connect(function(dt: number)
	for _, player in ipairs(Players:GetPlayers()) do
		local character = player.Character
		if character and character.Parent then
			processCharacterRegen(character, dt)
		end
	end
end)

---------------------------------------------------------
-- NETWORK NETWORKING BOUNDS
---------------------------------------------------------
-- Wrapping this in parentheses and adding ':: RemoteEvent' fixes the type checker
local toggleChargeEvent = ReplicatedStorage:WaitForChild("ToggleManaCharge") :: RemoteEvent

toggleChargeEvent.OnServerEvent:Connect(function(player: Player, state: any)
	if typeof(state) ~= "boolean" then return end
	local character = player.Character
	if character and character.Parent then
		character:SetAttribute("IsChargingMana", state)
	end
end)