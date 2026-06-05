-- Single client bootstrap: starts HUD + spell systems (avoids Rojo nested-script issues).
print("[ClientInit] Booting client systems...")

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local clientFolder = script.Parent

local function bootModule(moduleName: string)
	local modScript = clientFolder:WaitForChild(moduleName, 15)
	if not modScript or not modScript:IsA("ModuleScript") then
		warn("[ClientInit] Missing ModuleScript:", moduleName, "under", clientFolder:GetFullName())
		return false
	end
	local ok, mod = pcall(require, modScript)
	if not ok then
		warn("[ClientInit] require failed:", moduleName, mod)
		return false
	end
	if type(mod) == "table" and type(mod.start) == "function" then
		local startOk, startErr = pcall(mod.start)
		if not startOk then
			warn("[ClientInit] start failed:", moduleName, startErr)
			return false
		end
		print("[ClientInit] Started:", moduleName)
		return true
	end
	warn("[ClientInit] Module has no start():", moduleName)
	return false
end

if not ReplicatedStorage:FindFirstChild("Shared") then
	warn("[ClientInit] ReplicatedStorage.Shared missing — sync Rojo")
end

bootModule("ScreenEffects")
bootModule("GameplayHUDApp")
bootModule("SkillControllerApp")
bootModule("SpellVFXImpactApp")

print("[ClientInit] Boot complete")
