--!strict
-- Wire format for SpellImpactFX RemoteEvent (server -> all clients).

export type ImpactKind = "world" | "entity" | "dissipate"

export type SpellImpactPayload = {
	spellId: string,
	kind: ImpactKind,
	position: Vector3,
	hitColor: Color3?,
	hitMaterial: Enum.Material?,
	hitTransparency: number?,
}

local SpellImpactPayload = {}

function SpellImpactPayload.fromHitPart(
	spellId: string,
	kind: ImpactKind,
	position: Vector3,
	hitPart: BasePart?
): SpellImpactPayload
	local payload: SpellImpactPayload = {
		spellId = spellId,
		kind = kind,
		position = position,
		hitColor = nil,
		hitMaterial = nil,
		hitTransparency = nil,
	}

	if hitPart then
		payload.hitColor = hitPart.Color
		payload.hitMaterial = hitPart.Material
		payload.hitTransparency = hitPart.Transparency
	end

	return payload
end

return SpellImpactPayload
