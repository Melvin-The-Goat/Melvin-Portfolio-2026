--!strict
-- Spawns impact/dissipate VFX (intended for client; templates live in ReplicatedStorage).

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local VFXResolver = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("VFXResolver"))
local SpellVFXAssets = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellVFXAssets"))

type SpellAssets = SpellVFXAssets.SpellAssets
export type ImpactKind = "world" | "entity" | "dissipate"

local DISSIPATE_LIFETIME = 4

local SpellVFXPlayback = {}

local function namesFor(spellId: string): SpellAssets?
	return SpellVFXAssets.Names[spellId]
end

local function resolveEntityAsset(names: SpellAssets): string
	if names.EntityImpact ~= "" then
		return names.EntityImpact
	end
	return names.WorldImpact
end

function SpellVFXPlayback.play(spellId: string, kind: ImpactKind, position: Vector3)
	local names = namesFor(spellId)
	if not names then
		return
	end

	local assetName = ""
	local lifetime = SpellVFXAssets.getWorldImpactLifetime(spellId)

	if kind == "world" then
		assetName = names.WorldImpact
	elseif kind == "entity" then
		assetName = resolveEntityAsset(names)
	elseif kind == "dissipate" then
		assetName = names.Dissipate
		lifetime = DISSIPATE_LIFETIME
	end

	if assetName == "" then
		return
	end

	VFXResolver.spawnTemporary(assetName, workspace, CFrame.new(position), lifetime)
end

return SpellVFXPlayback
