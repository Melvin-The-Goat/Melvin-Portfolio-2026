--!strict
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local VFXResolver = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("VFXResolver"))
local SpellVFXAssets = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellVFXAssets"))
local SpellImpactPayload = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellImpactPayload"))

type SpellAssets = SpellVFXAssets.SpellAssets

export type ImpactContext = {
	SpellId: string,
	Position: Vector3,
	HitPart: BasePart?,
	HitModel: Model?,
	IsEntity: boolean,
	Damage: number,
}

export type ImpactKind = SpellImpactPayload.ImpactKind

local flightVFX: { [Instance]: Instance? } = {}
local chargeVFXByCharacter: { [Model]: Instance? } = {}

local impactRemote: RemoteEvent? = nil
if RunService:IsServer() then
	local existing = ReplicatedStorage:FindFirstChild("SpellImpactFX")
	if existing and existing:IsA("RemoteEvent") then
		impactRemote = existing
	else
		impactRemote = ReplicatedStorage:WaitForChild("SpellImpactFX", 10) :: RemoteEvent?
	end
end

local SpellVFX = {}

local function namesFor(spellId: string): SpellAssets?
	return SpellVFXAssets.Names[spellId]
end

local function replicateImpact(ctx: ImpactContext, kind: ImpactKind)
	if not impactRemote then
		return
	end
	local payload = SpellImpactPayload.fromHitPart(ctx.SpellId, kind, ctx.Position, ctx.HitPart)
	impactRemote:FireAllClients(payload)
end

function SpellVFX.onChargeBegin(spellId: string, character: Model, _chargeRatio: number)
	SpellVFX.onChargeEnd(spellId, character)

	local names = namesFor(spellId)
	if not names or names.Charge == "" then
		return
	end

	local hand = (character:FindFirstChild("RightHand") or character:FindFirstChild("HumanoidRootPart")) :: BasePart?
	if not hand then
		return
	end

	chargeVFXByCharacter[character] = VFXResolver.attachToPart(names.Charge, hand)
end

function SpellVFX.onChargeUpdate(_spellId: string, _character: Model, _chargeRatio: number) end

function SpellVFX.onChargeEnd(_spellId: string, character: Model)
	local fx = chargeVFXByCharacter[character]
	if fx then
		VFXResolver.stopAndDestroy(fx)
	end
	chargeVFXByCharacter[character] = nil
end

function SpellVFX.onFlightBegin(spellId: string, projectile: BasePart)
	local names = namesFor(spellId)
	if not names or names.Flight == "" then
		return
	end
	flightVFX[projectile] = VFXResolver.attachToPart(names.Flight, projectile)
end

function SpellVFX.onDissipate(spellId: string, position: Vector3)
	if impactRemote then
		local payload = SpellImpactPayload.fromHitPart(spellId, "dissipate", position, nil)
		impactRemote:FireAllClients(payload)
	end
end

function SpellVFX.onWorldImpact(ctx: ImpactContext)
	replicateImpact(ctx, "world")
end

function SpellVFX.onEntityImpact(ctx: ImpactContext)
	replicateImpact(ctx, "entity")
end

function SpellVFX.cleanupProjectile(projectile: BasePart)
	VFXResolver.stopAndDestroy(flightVFX[projectile])
	flightVFX[projectile] = nil
end

return SpellVFX
