--!strict
--[[
	Anime-style impact debris: tight spawn, burst impulse, high drag, shrink dissolve.
	Uses overlay color from server hit payload (surface Material is not copied).

	ImpulseMin/ImpulseMax are target velocity magnitudes; ApplyImpulse uses mass to normalize chunk size.
]]

local Debris = game:GetService("Debris")
local TweenService = game:GetService("TweenService")

export type DebrisBurstConfig = {
	Lifetime: number?,
	MinSize: number?,
	MaxSize: number?,
	ImpulseMin: number?,
	ImpulseMax: number?,
	ScatterRadius: number?,
	UseMetal: boolean?,
}

local DEFAULT_CONFIG: DebrisBurstConfig = {
	Lifetime = 0.55,
	MinSize = 0.35,
	MaxSize = 0.9,
	ImpulseMin = 30,
	ImpulseMax = 55,
	ScatterRadius = 0.3,
	UseMetal = false,
}

local ANIME_DRAG_PROPERTIES = PhysicalProperties.new(1.0, 0.1, 0.0, 100.0, 100.0)

local ImpactDebrisBurst = {}

local function randomUnitHemisphere(): Vector3
	local theta = math.random() * math.pi * 2
	local u = math.random()
	local y = math.sqrt(u)
	local horizontal = math.sqrt(1 - u)
	return Vector3.new(math.cos(theta) * horizontal, y, math.sin(theta) * horizontal)
end

local function resolveConfig(config: DebrisBurstConfig?): DebrisBurstConfig
	if not config then
		return table.clone(DEFAULT_CONFIG)
	end
	return {
		Lifetime = config.Lifetime or DEFAULT_CONFIG.Lifetime,
		MinSize = config.MinSize or DEFAULT_CONFIG.MinSize,
		MaxSize = config.MaxSize or DEFAULT_CONFIG.MaxSize,
		ImpulseMin = config.ImpulseMin or DEFAULT_CONFIG.ImpulseMin,
		ImpulseMax = config.ImpulseMax or DEFAULT_CONFIG.ImpulseMax,
		ScatterRadius = config.ScatterRadius or DEFAULT_CONFIG.ScatterRadius,
		UseMetal = if config.UseMetal ~= nil then config.UseMetal else DEFAULT_CONFIG.UseMetal,
	}
end

local function randomScatter(radius: number): Vector3
	return Vector3.new(
		(math.random() * 2 - 1) * radius,
		math.random() * radius,
		(math.random() * 2 - 1) * radius
	)
end

local function applyAnimeDrag(chunk: BasePart)
	chunk.CustomPhysicalProperties = ANIME_DRAG_PROPERTIES
end

local function tweenShrinkDissolve(chunk: BasePart, lifetime: number)
	local tweenInfo = TweenInfo.new(lifetime, Enum.EasingStyle.Quad, Enum.EasingDirection.In)
	local shrink = TweenService:Create(chunk, tweenInfo, {
		Size = Vector3.zero,
	})
	shrink:Play()
	shrink.Completed:Connect(function()
		if chunk.Parent then
			chunk:Destroy()
		end
	end)
end

function ImpactDebrisBurst.spawn(
	impactPosition: Vector3,
	overlayColor: Color3,
	transparency: number,
	config: DebrisBurstConfig?
)
	local cfg = resolveConfig(config)
	local lifetime = cfg.Lifetime or 0.55
	local minSize = cfg.MinSize or 0.35
	local maxSize = cfg.MaxSize or 0.9
	local impulseMin = cfg.ImpulseMin or 30
	local impulseMax = cfg.ImpulseMax or 55
	local scatterRadius = cfg.ScatterRadius or 0.3
	local debrisMaterial = if cfg.UseMetal then Enum.Material.CorrodedMetal else Enum.Material.Rock

	local count = math.random(6, 12)

	for _ = 1, count do
		local sizeScalar = minSize + math.random() * (maxSize - minSize)
		local startSize = Vector3.new(sizeScalar, sizeScalar, sizeScalar)

		local chunk = Instance.new("Part")
		chunk.Name = "SpellImpactDebris"
		chunk.Size = startSize
		chunk.Shape = Enum.PartType.Block
		chunk.Material = debrisMaterial
		chunk.Color = overlayColor
		chunk.Transparency = transparency
		chunk.CanCollide = false
		chunk.CanQuery = false
		chunk.CanTouch = false
		chunk.Anchored = false
		chunk.CastShadow = false
		applyAnimeDrag(chunk)

		chunk.CFrame = CFrame.new(impactPosition + randomScatter(scatterRadius))
		chunk.Parent = workspace

		local direction = randomUnitHemisphere()
		local targetVelocity = impulseMin + math.random() * (impulseMax - impulseMin)

		task.defer(function()
			if not chunk.Parent then
				return
			end
			local mass = chunk.AssemblyMass
			chunk:ApplyImpulse(direction * mass * targetVelocity)
		end)

		tweenShrinkDissolve(chunk, lifetime)
		Debris:AddItem(chunk, lifetime + 0.1)
	end
end

return ImpactDebrisBurst
