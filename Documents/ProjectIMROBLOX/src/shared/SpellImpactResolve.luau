--!strict
-- Shared impact resolution: destruction hook, damage, SpellImpactFX replication.

local SpellImpactResolve = {}

export type ImpactContext = {
	SpellId: string,
	Position: Vector3,
	HitPart: BasePart?,
	HitModel: Model?,
	IsEntity: boolean,
	Damage: number,
	CasterCharacter: Model,
}

export type DestructibleHandler = (hitPart: BasePart, damage: number, impactPosition: Vector3, spellId: string) -> ()

function SpellImpactResolve.isDamageableEntity(hitModel: Model?, caster: Model, humanoid: Humanoid?): boolean
	return humanoid ~= nil
		and humanoid.Health > 0
		and hitModel ~= nil
		and hitModel ~= caster
end

function SpellImpactResolve.resolve(
	ctx: ImpactContext,
	onDestructible: DestructibleHandler?,
	onEntityImpact: (ImpactContext) -> (),
	onWorldImpact: (ImpactContext) -> (),
	onDissipate: (spellId: string, position: Vector3) -> ()
)
	if ctx.HitPart and onDestructible then
		onDestructible(ctx.HitPart, ctx.Damage, ctx.Position, ctx.SpellId)
	end

	if ctx.IsEntity and ctx.HitModel then
		local humanoid = ctx.HitModel:FindFirstChildOfClass("Humanoid")
		if humanoid then
			onEntityImpact(ctx)
			humanoid:TakeDamage(ctx.Damage)
			return
		end
	end

	if ctx.HitPart then
		onWorldImpact(ctx)
	else
		onDissipate(ctx.SpellId, ctx.Position)
	end
end

return SpellImpactResolve
