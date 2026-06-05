--!strict
--[[
	DISABLE THIS SCRIPT in Studio if you still see a second copy outside Rojo.

	This file is intentionally a no-op. Spell casting runs only from:
	  ClientInit.client.lua  ->  SkillControllerApp.luau

	If an OLD version of SkillController (with full logic) also runs, you get:
	  - Double mana spend (two "release" events per cast)
	  - Double projectiles / desync

	In Explorer: delete or uncheck Enabled on any extra SkillController LocalScript
	that is NOT this disabled stub.
]]

print("[DISABLE THIS SkillController] Inactive — using ClientInit + SkillControllerApp")
