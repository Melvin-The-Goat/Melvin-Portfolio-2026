--!strict
-- Clones VFX/models from ReplicatedStorage by instance name (searches common folders first).

local Debris = game:GetService("Debris")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local SEARCH_ROOTS = { "VFX", "Effects", "SpellVFX", "Assets" }

local VFXResolver = {}

-- Resolves a VFX template by name. Only direct children of known roots are used so an
-- older duplicate nested under the same folder cannot win over the intended asset.
function VFXResolver.findTemplate(assetName: string): (Instance?, string?)
	if assetName == nil or assetName == "" or assetName == "none" or assetName == "None" then
		return nil, nil
	end

	for _, rootName in SEARCH_ROOTS do
		local root = ReplicatedStorage:FindFirstChild(rootName)
		if root then
			local direct = root:FindFirstChild(assetName)
			if direct then
				return direct, root:GetFullName() .. "." .. assetName
			end
		end
	end

	warn(
		"[VFXResolver] Asset not found (add as direct child of ReplicatedStorage.VFX):",
		assetName
	)
	return nil, nil
end

local function playSounds(root: Instance)
	for _, desc in root:GetDescendants() do
		if desc:IsA("Sound") then
			desc:Play()
		end
	end
	if root:IsA("Sound") then
		root:Play()
	end
end

local function enableAndEmit(root: Instance)
	for _, desc in root:GetDescendants() do
		if desc:IsA("ParticleEmitter") then
			desc.Enabled = true
			if desc.Rate <= 0 then
				desc:Emit(desc:GetAttribute("EmitCount") or 8)
			end
		end
	end
	if root:IsA("ParticleEmitter") then
		root.Enabled = true
		if root.Rate <= 0 then
			root:Emit(root:GetAttribute("EmitCount") or 8)
		end
	end
	playSounds(root)
end

local function disableEffects(root: Instance)
	for _, desc in root:GetDescendants() do
		if desc:IsA("ParticleEmitter") or desc:IsA("Trail") then
			desc.Enabled = false
		end
	end
	if root:IsA("ParticleEmitter") or root:IsA("Trail") then
		root.Enabled = false
	end
end

local function ensureModelPrimaryPart(model: Model): BasePart?
	if model.PrimaryPart then
		return model.PrimaryPart
	end
	local part = model:FindFirstChildWhichIsA("BasePart", true)
	if part then
		model.PrimaryPart = part
	end
	return part
end

local function pivotClone(clone: Instance, cf: CFrame, parent: Instance)
	if clone:IsA("Model") then
		ensureModelPrimaryPart(clone)
		clone:PivotTo(cf)
	elseif clone:IsA("BasePart") then
		clone.CFrame = cf
	elseif clone:IsA("Attachment") then
		clone.WorldCFrame = cf
	elseif clone:IsA("Folder") then
		local parts: { BasePart } = {}
		for _, desc in clone:GetDescendants() do
			if desc:IsA("BasePart") then
				table.insert(parts, desc)
			end
		end
		if #parts > 0 then
			local anchor = parts[1].CFrame
			for _, part in parts do
				local offset = anchor:ToObjectSpace(part.CFrame)
				part.CFrame = cf * offset
			end
		end
	elseif clone:IsA("ParticleEmitter") then
		local anchor = Instance.new("Part")
		anchor.Name = "VFXAnchor"
		anchor.Size = Vector3.new(0.2, 0.2, 0.2)
		anchor.Transparency = 1
		anchor.Anchored = true
		anchor.CanCollide = false
		anchor.CanQuery = false
		anchor.CanTouch = false
		anchor.CFrame = cf
		anchor.Parent = parent
		clone.Parent = anchor
		return
	end
end

function VFXResolver.stopAndDestroy(instance: Instance?)
	if not instance then
		return
	end
	disableEffects(instance)
	instance:Destroy()
end

function VFXResolver.cloneAt(assetName: string, parent: Instance, pivot: CFrame?): Instance?
	local template = VFXResolver.findTemplate(assetName)
	if not template then
		return nil
	end

	local clone = template:Clone()
	local cf = pivot or CFrame.new()

	pivotClone(clone, cf, parent)
	if clone.Parent == nil then
		clone.Parent = parent
	elseif clone.Parent ~= parent and not clone.Parent:IsDescendantOf(parent) then
		clone.Parent = parent
	end

	local root = clone
	if clone.Parent and clone.Parent:IsA("BasePart") and clone.Parent.Name == "VFXAnchor" then
		root = clone.Parent
	end
	return root
end

-- Spawns at position/parent and removes after lifetime seconds (Debris).
function VFXResolver.spawnTemporary(
	assetName: string,
	parent: Instance,
	pivot: CFrame?,
	lifetime: number
): Instance?
	local root = VFXResolver.cloneAt(assetName, parent, pivot)
	if root then
		enableAndEmit(root)
		if lifetime > 0 then
			Debris:AddItem(root, lifetime)
		end
	end
	return root
end

function VFXResolver.attachToPart(assetName: string, host: BasePart): Instance?
	local template = VFXResolver.findTemplate(assetName)
	if not template then
		return nil
	end

	local clone = template:Clone()
	clone.Parent = host

	if clone:IsA("Attachment") then
		clone.Position = Vector3.zero
	elseif clone:IsA("Model") then
		ensureModelPrimaryPart(clone)
		clone:PivotTo(host.CFrame)
	elseif clone:IsA("BasePart") then
		clone.CFrame = host.CFrame
	end

	enableAndEmit(clone)

	return clone
end

function VFXResolver.destroy(instance: Instance?)
	VFXResolver.stopAndDestroy(instance)
end

return VFXResolver
