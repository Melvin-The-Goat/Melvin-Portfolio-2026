--!strict
--[[
	SPELL VFX ASSET NAMES — edit Names below to hook up your particles and models.

	Place assets as DIRECT children under ReplicatedStorage.VFX (not nested duplicates):
	  ReplicatedStorage.VFX.FireballWorldHit

	Names here must match instance names exactly. Remove old unused copies in Studio
	or the wrong effect can appear after renames.

	Leave "" to skip an effect.

	Timing.WorldImpactLifetime — how long world impact FX stay before Debris removes them.
	Charge FX are removed when charging ends (not timed here).
]]

export type SpellAssets = {
	Charge: string,
	Flight: string,
	WorldImpact: string,
	EntityImpact: string,
	Dissipate: string,
}

export type SpellVFXTiming = {
	WorldImpactLifetime: number,
}

local SpellVFXAssets = {}

SpellVFXAssets.DefaultTiming = {
	WorldImpactLifetime = 4,
}

SpellVFXAssets.Timing = {
	Fireball_Lvl1 = {
		WorldImpactLifetime = 4,
	},
} :: { [string]: SpellVFXTiming }

SpellVFXAssets.Names = {
	Fireball_Lvl1 = {
		Charge = "FireballCharge",
		Flight = "Smoke",
		WorldImpact = "FireballWorldHit",
		EntityImpact = "FireballEntityHit",
		Dissipate = "",
	},
} :: { [string]: SpellAssets }

function SpellVFXAssets.getTiming(spellId: string): SpellVFXTiming
	return SpellVFXAssets.Timing[spellId] or SpellVFXAssets.DefaultTiming
end

function SpellVFXAssets.getWorldImpactLifetime(spellId: string): number
	return SpellVFXAssets.getTiming(spellId).WorldImpactLifetime
end

return SpellVFXAssets
