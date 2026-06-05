--!strict
-- Single source of truth for which skills a player has unlocked (client + server).

local HttpService = game:GetService("HttpService")

local SkillUnlock = {}

-- Starter skills always merged into unlock list (prevents "lost" fireball after empty saves).
SkillUnlock.StarterSkills = { "Fireball_Lvl1" }

local function decodeList(json: unknown): { string }?
	if typeof(json) ~= "string" then
		return nil
	end
	local ok, decoded = pcall(function()
		return HttpService:JSONDecode(json)
	end)
	if not ok or typeof(decoded) ~= "table" then
		return nil
	end
	local list: { string } = {}
	for _, entry in decoded do
		if typeof(entry) == "string" and entry ~= "" then
			table.insert(list, entry)
		end
	end
	return list
end

function SkillUnlock.mergeStarterSkills(list: { string }): { string }
	local merged: { string } = {}
	local seen: { [string]: boolean } = {}

	local function add(id: string)
		if id ~= "" and not seen[id] then
			seen[id] = true
			table.insert(merged, id)
		end
	end

	for _, id in list do
		add(id)
	end
	for _, id in SkillUnlock.StarterSkills do
		add(id)
	end

	return merged
end

function SkillUnlock.normalizeJson(json: unknown): string
	local list = decodeList(json)
	if not list then
		return HttpService:JSONEncode(SkillUnlock.mergeStarterSkills({}))
	end
	return HttpService:JSONEncode(SkillUnlock.mergeStarterSkills(list))
end

function SkillUnlock.getList(player: Player): { string }
	local json = player:GetAttribute("UnlockedSkills")
	local list = decodeList(json)
	if not list then
		return table.clone(SkillUnlock.mergeStarterSkills({}))
	end
	return SkillUnlock.mergeStarterSkills(list)
end

function SkillUnlock.hasSkill(player: Player, skillId: string): boolean
	return table.find(SkillUnlock.getList(player), skillId) ~= nil
end

function SkillUnlock.ensurePlayerDefaults(player: Player)
	local normalized = SkillUnlock.normalizeJson(player:GetAttribute("UnlockedSkills"))
	if player:GetAttribute("UnlockedSkills") ~= normalized then
		player:SetAttribute("UnlockedSkills", normalized)
	end
end

return SkillUnlock
