--!strict
-- Replicated spell cooldown end times on the caster's character (server writes, client reads).

local SpellCooldown = {}

local ATTR_PREFIX = "SpellCooldownEnds_"

function SpellCooldown.getAttributeName(spellId: string): string
	return ATTR_PREFIX .. spellId
end

function SpellCooldown.setEndsAt(character: Model, spellId: string, endsAt: number)
	character:SetAttribute(SpellCooldown.getAttributeName(spellId), endsAt)
end

function SpellCooldown.apply(character: Model, spellId: string, cooldownSeconds: number)
	SpellCooldown.setEndsAt(character, spellId, os.clock() + cooldownSeconds)
end

function SpellCooldown.isActive(character: Model, spellId: string): boolean
	local endsAt = character:GetAttribute(SpellCooldown.getAttributeName(spellId))
	return typeof(endsAt) == "number" and os.clock() < endsAt
end

function SpellCooldown.getRemaining(character: Model, spellId: string): number
	local endsAt = character:GetAttribute(SpellCooldown.getAttributeName(spellId))
	if typeof(endsAt) ~= "number" then
		return 0
	end
	return math.max(0, endsAt - os.clock())
end

return SpellCooldown
