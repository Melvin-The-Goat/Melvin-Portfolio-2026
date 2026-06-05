--!strict
--[[
	Master spell balance sheet — change numbers here, not in combat scripts.
	Max travel distance = min(Travel.MaxDistance, Travel.Speed * Travel.MaxLifetime)
]]

export type ChargeScaling = {
	Min: number,
	Max: number,
}

export type TravelSettings = {
	Speed: number,
	MaxDistance: number,
	MaxLifetime: number,
	-- Scales linear flight time down so Exponential-In tween feels snappier (anime snap).
	FlightDurationScale: number,
}

export type DestructionSettings = {
	BlowAwayImpulse: number,
	PartCleanupSeconds: number,
}

export type SkillDefinition = {
	Id: string,
	DisplayName: string,
	ManaCost: number,
	Damage: number,
	Size: Vector3,
	Travel: TravelSettings,
	MinChargeTime: number,
	MaxChargeTime: number,
	ChargeDamageScale: ChargeScaling,
	ChargeSizeScale: ChargeScaling,
	DefaultKeybind: Enum.KeyCode,
	Cooldown: number,
	Color: Color3,
	HotbarOrder: number,
	Destruction: DestructionSettings,
}

local SkillSettings = {}

SkillSettings.Skills = {
	Fireball_Lvl1 = {
		Id = "Fireball_Lvl1",
		DisplayName = "Fireball",
		ManaCost = 50,
		Damage = 35,
		Size = Vector3.new(3, 3, 3),
		Travel = {
			Speed = 75,
			MaxDistance = 262.5,
			MaxLifetime = 3.5,
			FlightDurationScale = 0.72,
		},
		MinChargeTime = 0.15,
		MaxChargeTime = 1.5,
		ChargeDamageScale = { Min = 0.5, Max = 1.0 },
		ChargeSizeScale = { Min = 0.6, Max = 1.0 },
		DefaultKeybind = Enum.KeyCode.E,
		Cooldown = 2.0,
		Color = Color3.fromRGB(255, 100, 0),
		HotbarOrder = 1,
		Destruction = {
			BlowAwayImpulse = 12000,
			PartCleanupSeconds = 3,
		},
	},
	-- ShadowBolt = { ... }
} :: { [string]: SkillDefinition }

function SkillSettings.get(skillId: string): SkillDefinition?
	return SkillSettings.Skills[skillId]
end

function SkillSettings.listOrdered(): { SkillDefinition }
	local list: { SkillDefinition } = {}
	for _, skill in pairs(SkillSettings.Skills) do
		table.insert(list, skill)
	end
	table.sort(list, function(a, b)
		return a.HotbarOrder < b.HotbarOrder
	end)
	return list
end

-- Server must call this before casting; sub-minimum releases must be rejected, not clamped here.
function SkillSettings.isChargeTimeValid(skill: SkillDefinition, chargeTime: number): boolean
	return chargeTime >= skill.MinChargeTime
end

function SkillSettings.resolveReleaseChargeTime(channelStartedAt: number, payloadChargeTime: any): number
	local serverChargeTime = math.max(0, os.clock() - channelStartedAt)
	if typeof(payloadChargeTime) == "number" and payloadChargeTime == payloadChargeTime then
		return math.min(math.max(0, payloadChargeTime), serverChargeTime)
	end
	return serverChargeTime
end

function SkillSettings.getChargeRatio(skill: SkillDefinition, chargeTime: number): number
	local t = math.clamp(chargeTime, skill.MinChargeTime, skill.MaxChargeTime)
	local span = skill.MaxChargeTime - skill.MinChargeTime
	if span <= 0 then
		return 1
	end
	return (t - skill.MinChargeTime) / span
end

function SkillSettings.scaleDamage(skill: SkillDefinition, chargeRatio: number): number
	local s = skill.ChargeDamageScale
	return skill.Damage * (s.Min + (s.Max - s.Min) * chargeRatio)
end

function SkillSettings.scaleSize(skill: SkillDefinition, chargeRatio: number): Vector3
	local s = skill.ChargeSizeScale
	local mult = s.Min + (s.Max - s.Min) * chargeRatio
	return skill.Size * mult
end

function SkillSettings.getMaxTravelDistance(skill: SkillDefinition): number
	local travel = skill.Travel
	return math.min(travel.MaxDistance, travel.Speed * travel.MaxLifetime)
end

function SkillSettings.getTravelDuration(skill: SkillDefinition): number
	local travel = skill.Travel
	local maxDist = SkillSettings.getMaxTravelDistance(skill)
	if travel.Speed <= 0 then
		return travel.MaxLifetime
	end
	return math.min(travel.MaxLifetime, maxDist / travel.Speed)
end

return SkillSettings
