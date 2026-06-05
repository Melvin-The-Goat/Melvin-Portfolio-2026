--!strict
-- Listens for server impact events and spawns VFX on the client (particles render reliably here).

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local SpellImpactPayloadModule = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellImpactPayload"))
type SpellImpactPayload = SpellImpactPayloadModule.SpellImpactPayload

local SpellVFXImpactApp = {}

local function asMaterial(value: unknown): Enum.Material?
	if typeof(value) ~= "EnumItem" then
		return nil
	end
	local item = value :: EnumItem
	if item.EnumType == Enum.Material then
		return item :: Enum.Material
	end
	return nil
end

local function shouldUseMetalDebris(material: Enum.Material?): boolean
	if not material then
		return false
	end
	return material == Enum.Material.Metal
		or material == Enum.Material.DiamondPlate
		or material == Enum.Material.CorrodedMetal
		or material == Enum.Material.Ice
end

local function parsePayload(payload: any): SpellImpactPayload?
	if typeof(payload) ~= "table" then
		return nil
	end

	local spellId = payload.spellId
	local kind = payload.kind
	local position = payload.position
	if typeof(spellId) ~= "string" or typeof(kind) ~= "string" or typeof(position) ~= "Vector3" then
		return nil
	end
	if kind ~= "world" and kind ~= "entity" and kind ~= "dissipate" then
		return nil
	end

	local hitTransparency = payload.hitTransparency

	return {
		spellId = spellId,
		kind = kind :: SpellImpactPayloadModule.ImpactKind,
		position = position,
		hitColor = if typeof(payload.hitColor) == "Color3" then payload.hitColor :: Color3 else nil,
		hitMaterial = asMaterial(payload.hitMaterial),
		hitTransparency = if typeof(hitTransparency) == "number" then hitTransparency else nil,
	}
end

function SpellVFXImpactApp.start()
	local clientFolder = script.Parent
	local SpellVFXPlayback = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("SpellVFXPlayback"))
	local ScreenEffects = require(clientFolder:WaitForChild("ScreenEffects"))
	local ImpactDebrisBurst = require(clientFolder:WaitForChild("ImpactDebrisBurst"))

	local remote = ReplicatedStorage:WaitForChild("SpellImpactFX")
	if not remote:IsA("RemoteEvent") then
		warn("[SpellVFXImpact] SpellImpactFX must be a RemoteEvent")
		return
	end

	remote.OnClientEvent:Connect(function(payload: any)
		local impact = parsePayload(payload)
		if not impact then
			return
		end

		SpellVFXPlayback.play(impact.spellId, impact.kind, impact.position)

		if impact.kind == "world" or impact.kind == "entity" then
			local intensity = if impact.kind == "entity" then 1.1 else 1.0
			ScreenEffects.onImpact({
				magnitude = 0.085 * intensity,
				decay = 9,
			})
			ScreenEffects.playImpactFlash()

			if impact.hitColor then
				local transparency = impact.hitTransparency or 0
				ImpactDebrisBurst.spawn(impact.position, impact.hitColor, transparency, {
					UseMetal = shouldUseMetalDebris(impact.hitMaterial),
				})
			end
		end
	end)

	print("[SpellVFXImpact] Listening for impact VFX")
end

return SpellVFXImpactApp
