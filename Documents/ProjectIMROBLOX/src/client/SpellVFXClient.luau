--!strict
--[[
	CLIENT charge VFX while holding the spell key.
	Charge FX are destroyed in onChargeEnd when the player stops charging.

	Edit asset names in Shared/SpellVFXAssets.luau
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local VFXResolver = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("VFXResolver"))
local SpellVFXAssets = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellVFXAssets"))

type SpellAssets = SpellVFXAssets.SpellAssets

local ASSET_NAMES: { [string]: SpellAssets } = SpellVFXAssets.Names

local activeChargeVFX: { [string]: Instance? } = {}

local SpellVFXClient = {}

local function getNames(spellId: string): SpellAssets?
	return ASSET_NAMES[spellId]
end

local function getHand(character: Model): BasePart?
	return (character:FindFirstChild("RightHand") or character:FindFirstChild("LeftHand")) :: BasePart?
end

local function clearChargeVFX(spellId: string)
	local existing = activeChargeVFX[spellId]
	if existing then
		VFXResolver.stopAndDestroy(existing)
		activeChargeVFX[spellId] = nil
	end
end

function SpellVFXClient.onChargeBegin(spellId: string, character: Model)
	local names = getNames(spellId)
	if not names or names.Charge == "" then
		return
	end

	clearChargeVFX(spellId)

	local hand = getHand(character)
	local parent: Instance = hand or character:FindFirstChild("HumanoidRootPart") or character
	local pivot = if hand then hand.CFrame else character:GetPivot()
	activeChargeVFX[spellId] = VFXResolver.cloneAt(names.Charge, parent, pivot)
end

function SpellVFXClient.onChargeUpdate(spellId: string, character: Model, _chargeRatio: number)
	local clone = activeChargeVFX[spellId]
	local hand = getHand(character)
	if clone and hand and clone.Parent then
		if clone:IsA("Model") then
			clone:PivotTo(hand.CFrame)
		elseif clone:IsA("BasePart") then
			clone.CFrame = hand.CFrame
		end
	end
end

function SpellVFXClient.onChargeEnd(spellId: string, _character: Model)
	clearChargeVFX(spellId)
end

function SpellVFXClient.clearAllChargeVFX()
	for spellId, _ in pairs(activeChargeVFX) do
		clearChargeVFX(spellId)
	end
end

return SpellVFXClient
