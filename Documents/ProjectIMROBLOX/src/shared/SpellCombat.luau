--!strict
--[[
	Legacy entry point — server projectile logic lives in Server/SpellProjectile.luau.
	CombatManager calls SpellProjectile directly; this module remains for compatibility.
]]

local RunService = game:GetService("RunService")
local ServerScriptService = game:GetService("ServerScriptService")

export type CastParams = {
	Player: Player,
	Character: Model,
	SpellId: string,
	Origin: Vector3,
	TargetPosition: Vector3,
	ChargeRatio: number,
}

local SpellCombat = {}

function SpellCombat.launch(params: CastParams)
	if not RunService:IsServer() then
		warn("[SpellCombat] launch() is server-only")
		return
	end

	local serverFolder = ServerScriptService:WaitForChild("Server")
	local SpellProjectile = require(serverFolder:WaitForChild("SpellProjectile"))
	SpellProjectile.launch(params)
end

return SpellCombat
