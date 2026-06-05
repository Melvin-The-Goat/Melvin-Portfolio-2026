-- Gameplay HUD + skill hotbar (bottom center)
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local HttpService = game:GetService("HttpService")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
if not player then
	player = Players.PlayerAdded:Wait()
end

local function showLoadError(reason: string)
	local pg = player:FindFirstChild("PlayerGui") or player:WaitForChild("PlayerGui", 10)
	if not pg then
		warn("[GameplayHUD]", reason)
		return
	end
	local gui = Instance.new("ScreenGui")
	gui.Name = "GameplayHUD_Error"
	gui.ResetOnSpawn = false
	gui.DisplayOrder = 100
	gui.Parent = pg
	local label = Instance.new("TextLabel")
	label.Size = UDim2.new(0.8, 0, 0, 80)
	label.Position = UDim2.new(0.1, 0, 0.1, 0)
	label.BackgroundColor3 = Color3.fromRGB(80, 20, 20)
	label.TextColor3 = Color3.fromRGB(255, 255, 255)
	label.TextWrapped = true
	label.Text = "[GameplayHUD] " .. reason
	label.Font = Enum.Font.SourceSansBold
	label.TextSize = 18
	label.Parent = gui
end

local SkillSettings: any
local SkillBarState: any
local SkillUnlock: any

local function loadDependencies(): boolean
	local shared = ReplicatedStorage:WaitForChild("Shared", 20)
	if not shared then
		showLoadError("ReplicatedStorage.Shared missing — sync Rojo / check default.project.json")
		return false
	end

	local settingsModule = shared:WaitForChild("SkillSettings", 15)
	if not settingsModule then
		showLoadError("SkillSettings module missing under ReplicatedStorage.Shared")
		return false
	end

	local settingsOk, settingsResult = pcall(require, settingsModule)
	if not settingsOk then
		showLoadError("SkillSettings failed to load: " .. tostring(settingsResult))
		return false
	end
	SkillSettings = settingsResult

	local barModule = shared:WaitForChild("SkillBarState", 15)
	if not barModule then
		showLoadError("SkillBarState missing under ReplicatedStorage.Shared")
		return false
	end

	local barOk, barResult = pcall(require, barModule)
	if not barOk then
		showLoadError("SkillBarState failed to load: " .. tostring(barResult))
		return false
	end
	SkillBarState = barResult

	local unlockModule = shared:WaitForChild("SkillUnlock", 15)
	if not unlockModule then
		showLoadError("SkillUnlock missing under ReplicatedStorage.Shared")
		return false
	end
	local unlockOk, unlockResult = pcall(require, unlockModule)
	if not unlockOk then
		showLoadError("SkillUnlock failed to load: " .. tostring(unlockResult))
		return false
	end
	SkillUnlock = unlockResult

	return true
end

local _depsOk = loadDependencies()

local rebindingSkillId: string? = nil
local slotButtons: { [string]: TextButton } = {}
local keybindRowLabels: { [string]: TextButton } = {}
local screenGui: ScreenGui? = nil
local buildHotbarSlots: (() -> ())? = nil
local refreshSlotStyles: (() -> ())? = nil
local refreshKeybindPanel: (() -> ())? = nil
local keybindPanel: Frame? = nil
local keybindStatusLabel: TextLabel? = nil

local function isUnlocked(skillId: string): boolean
	if not SkillUnlock then
		return false
	end
	return SkillUnlock.hasSkill(player, skillId)
end

local function addCorner(parent: GuiObject, radius: number)
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, radius)
	corner.Parent = parent
end

local function createHUD()
	local playerGui = player:WaitForChild("PlayerGui", 30)
	if not playerGui then
		warn("[GameplayHUD] PlayerGui not found")
		return
	end

	if screenGui and screenGui.Parent then
		screenGui:Destroy()
	end

	screenGui = Instance.new("ScreenGui")
	screenGui.Name = "GameplayHUD"
	screenGui.ResetOnSpawn = false
	screenGui.IgnoreGuiInset = true
	screenGui.DisplayOrder = 50
	screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
	screenGui.Enabled = true
	screenGui.Parent = playerGui

	local container = Instance.new("Frame")
	container.Name = "ResourceBars"
	container.Size = UDim2.new(0, 300, 0, 150)
	container.Position = UDim2.new(0, 20, 0, 20)
	container.BackgroundTransparency = 1
	container.Parent = screenGui

	local layout = Instance.new("UIListLayout")
	layout.Padding = UDim.new(0, 10)
	layout.SortOrder = Enum.SortOrder.LayoutOrder
	layout.Parent = container

	local function createBar(name: string, color: Color3, order: number)
		local barContainer = Instance.new("Frame")
		barContainer.Name = name .. "BarContainer"
		barContainer.Size = UDim2.new(1, 0, 0, 25)
		barContainer.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
		barContainer.BorderSizePixel = 0
		barContainer.LayoutOrder = order
		barContainer.Parent = container
		addCorner(barContainer, 4)

		local fill = Instance.new("Frame")
		fill.Name = "Fill"
		fill.Size = UDim2.new(1, 0, 1, 0)
		fill.BackgroundColor3 = color
		fill.BorderSizePixel = 0
		fill.Parent = barContainer
		addCorner(fill, 4)

		return barContainer, fill
	end

	local staminaBar, staminaFill = createBar("Stamina", Color3.fromRGB(241, 196, 15), 2)
	local _, healthFill = createBar("Health", Color3.fromRGB(46, 204, 113), 1)
	local _, reserveFill = createBar("ManaReserve", Color3.fromRGB(25, 42, 86), 3)
	local _, activeFill = createBar("ActiveMana", Color3.fromRGB(0, 168, 255), 4)

	local exhaustedLabel = Instance.new("TextLabel")
	exhaustedLabel.Size = UDim2.new(1, 0, 1, 0)
	exhaustedLabel.BackgroundTransparency = 1
	exhaustedLabel.Text = "EXHAUSTED"
	exhaustedLabel.TextColor3 = Color3.fromRGB(255, 50, 50)
	exhaustedLabel.Font = Enum.Font.SourceSansBold
	exhaustedLabel.TextSize = 18
	exhaustedLabel.Visible = false
	exhaustedLabel.Parent = staminaBar

	local hotbarRoot = Instance.new("Frame")
	hotbarRoot.Name = "SkillHotbarRoot"
	hotbarRoot.AnchorPoint = Vector2.new(0.5, 1)
	hotbarRoot.Size = UDim2.new(0, 480, 0, 120)
	hotbarRoot.Position = UDim2.new(0.5, 0, 1, -20)
	hotbarRoot.BackgroundTransparency = 1
	hotbarRoot.Parent = screenGui

	local hotbarTitle = Instance.new("TextLabel")
	hotbarTitle.Size = UDim2.new(1, -100, 0, 22)
	hotbarTitle.BackgroundTransparency = 1
	hotbarTitle.Font = Enum.Font.SourceSansBold
	hotbarTitle.TextSize = 15
	hotbarTitle.TextColor3 = Color3.fromRGB(255, 255, 255)
	hotbarTitle.Text = "SKILL BAR — click slot to equip"
	hotbarTitle.Parent = hotbarRoot

	local keybindsButton = Instance.new("TextButton")
	keybindsButton.Name = "KeybindsButton"
	keybindsButton.Size = UDim2.new(0, 90, 0, 22)
	keybindsButton.Position = UDim2.new(1, -94, 0, 0)
	keybindsButton.BackgroundColor3 = Color3.fromRGB(55, 55, 70)
	keybindsButton.BorderSizePixel = 0
	keybindsButton.Font = Enum.Font.SourceSansBold
	keybindsButton.TextSize = 13
	keybindsButton.TextColor3 = Color3.fromRGB(255, 255, 255)
	keybindsButton.Text = "Keybinds"
	keybindsButton.Parent = hotbarRoot
	addCorner(keybindsButton, 6)

	local hotbar = Instance.new("Frame")
	hotbar.Name = "SkillHotbar"
	hotbar.Size = UDim2.new(1, 0, 0, 74)
	hotbar.Position = UDim2.new(0, 0, 0, 26)
	hotbar.BackgroundColor3 = Color3.fromRGB(15, 15, 15)
	hotbar.BackgroundTransparency = 0.1
	hotbar.BorderSizePixel = 0
	hotbar.Parent = hotbarRoot
	addCorner(hotbar, 10)

	local hotbarStroke = Instance.new("UIStroke")
	hotbarStroke.Color = Color3.fromRGB(255, 140, 60)
	hotbarStroke.Thickness = 2
	hotbarStroke.Parent = hotbar

	local slotLayout = Instance.new("UIListLayout")
	slotLayout.FillDirection = Enum.FillDirection.Horizontal
	slotLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
	slotLayout.VerticalAlignment = Enum.VerticalAlignment.Center
	slotLayout.Padding = UDim.new(0, 10)
	slotLayout.Parent = hotbar

	local equippedLabel = Instance.new("TextLabel")
	equippedLabel.Name = "EquippedHint"
	equippedLabel.Size = UDim2.new(1, 0, 0, 18)
	equippedLabel.Position = UDim2.new(0, 0, 1, 4)
	equippedLabel.BackgroundTransparency = 1
	equippedLabel.Font = Enum.Font.SourceSans
	equippedLabel.TextSize = 13
	equippedLabel.TextColor3 = Color3.fromRGB(220, 220, 220)
	equippedLabel.Parent = hotbarRoot

	keybindPanel = Instance.new("Frame")
	keybindPanel.Name = "KeybindSettingsPanel"
	keybindPanel.AnchorPoint = Vector2.new(0.5, 0.5)
	keybindPanel.Size = UDim2.new(0, 340, 0, 280)
	keybindPanel.Position = UDim2.new(0.5, 0, 0.5, 0)
	keybindPanel.BackgroundColor3 = Color3.fromRGB(22, 22, 28)
	keybindPanel.BorderSizePixel = 0
	keybindPanel.Visible = false
	keybindPanel.ZIndex = 10
	keybindPanel.Parent = screenGui
	addCorner(keybindPanel, 10)

	local panelTitle = Instance.new("TextLabel")
	panelTitle.Size = UDim2.new(1, -80, 0, 32)
	panelTitle.Position = UDim2.new(0, 12, 0, 8)
	panelTitle.BackgroundTransparency = 1
	panelTitle.Font = Enum.Font.SourceSansBold
	panelTitle.TextSize = 18
	panelTitle.TextXAlignment = Enum.TextXAlignment.Left
	panelTitle.TextColor3 = Color3.fromRGB(255, 255, 255)
	panelTitle.Text = "Keybind Settings"
	panelTitle.ZIndex = 11
	panelTitle.Parent = keybindPanel

	local closePanelButton = Instance.new("TextButton")
	closePanelButton.Size = UDim2.new(0, 28, 0, 28)
	closePanelButton.Position = UDim2.new(1, -36, 0, 10)
	closePanelButton.BackgroundColor3 = Color3.fromRGB(80, 40, 40)
	closePanelButton.Text = "X"
	closePanelButton.Font = Enum.Font.SourceSansBold
	closePanelButton.TextSize = 16
	closePanelButton.TextColor3 = Color3.fromRGB(255, 255, 255)
	closePanelButton.ZIndex = 11
	closePanelButton.Parent = keybindPanel
	addCorner(closePanelButton, 6)

	keybindStatusLabel = Instance.new("TextLabel")
	keybindStatusLabel.Size = UDim2.new(1, -24, 0, 36)
	keybindStatusLabel.Position = UDim2.new(0, 12, 0, 40)
	keybindStatusLabel.BackgroundTransparency = 1
	keybindStatusLabel.Font = Enum.Font.SourceSans
	keybindStatusLabel.TextSize = 13
	keybindStatusLabel.TextWrapped = true
	keybindStatusLabel.TextXAlignment = Enum.TextXAlignment.Left
	keybindStatusLabel.TextColor3 = Color3.fromRGB(200, 200, 210)
	keybindStatusLabel.Text = "Click a skill, then press a key. Esc cancels. Do not bind F (lock-on)."
	keybindStatusLabel.ZIndex = 11
	keybindStatusLabel.Parent = keybindPanel

	local skillList = Instance.new("ScrollingFrame")
	skillList.Name = "SkillList"
	skillList.Size = UDim2.new(1, -24, 1, -92)
	skillList.Position = UDim2.new(0, 12, 0, 78)
	skillList.BackgroundColor3 = Color3.fromRGB(30, 30, 38)
	skillList.BorderSizePixel = 0
	skillList.ScrollBarThickness = 6
	skillList.AutomaticCanvasSize = Enum.AutomaticSize.Y
	skillList.ZIndex = 11
	skillList.Parent = keybindPanel
	addCorner(skillList, 8)

	local listLayout = Instance.new("UIListLayout")
	listLayout.Padding = UDim.new(0, 6)
	listLayout.SortOrder = Enum.SortOrder.LayoutOrder
	listLayout.Parent = skillList

	refreshSlotStyles = function()
		local equippedId = SkillBarState.getEquippedId()
		for skillId, button in pairs(slotButtons) do
			local skill = SkillSettings.get(skillId)
			local keyLabel = SkillBarState.keyCodeToLabel(SkillBarState.getKeybind(skillId))
			if skill then
				local locked = not isUnlocked(skillId)
				button.Text = skill.DisplayName .. "\n[" .. keyLabel .. "]" .. (locked and "\n(Locked)" or "")
			end
			local stroke = button:FindFirstChildOfClass("UIStroke")
			if skillId == equippedId and isUnlocked(skillId) then
				button.BackgroundColor3 = Color3.fromRGB(200, 80, 0)
				if stroke then
					stroke.Thickness = 2
					stroke.Color = Color3.fromRGB(255, 220, 120)
				end
			elseif isUnlocked(skillId) then
				button.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
				if stroke then
					stroke.Thickness = 0
				end
			else
				button.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
				button.TextTransparency = 0.4
			end
		end

		local equippedSkill = SkillSettings.get(equippedId)
		if equippedSkill then
			local key = SkillBarState.keyCodeToLabel(SkillBarState.getEquippedKeybind())
			equippedLabel.Text = "Equipped: " .. equippedSkill.DisplayName .. " | Hold [" .. key .. "] to cast"
		end
	end

	refreshKeybindPanel = function()
		for _, child in ipairs(skillList:GetChildren()) do
			if child:IsA("TextButton") then
				child:Destroy()
			end
		end
		table.clear(keybindRowLabels)

		for _, skill in SkillSettings.listOrdered() do
			if not isUnlocked(skill.Id) then
				continue
			end

			local row = Instance.new("TextButton")
			row.Name = skill.Id
			row.Size = UDim2.new(1, -12, 0, 36)
			row.BackgroundColor3 = Color3.fromRGB(45, 45, 55)
			row.BorderSizePixel = 0
			row.Font = Enum.Font.SourceSans
			row.TextSize = 14
			row.TextXAlignment = Enum.TextXAlignment.Left
			row.TextColor3 = Color3.fromRGB(240, 240, 240)
			row.AutoButtonColor = true
			row.ZIndex = 12
			row.Parent = skillList
			addCorner(row, 6)

			local keyLabel = SkillBarState.keyCodeToLabel(SkillBarState.getKeybind(skill.Id))
			row.Text = "  " .. skill.DisplayName .. "  —  [" .. keyLabel .. "]"
			keybindRowLabels[skill.Id] = row

			if rebindingSkillId == skill.Id then
				row.BackgroundColor3 = Color3.fromRGB(90, 60, 30)
				row.Text = "  " .. skill.DisplayName .. "  —  press a key..."
			end

			row.MouseButton1Click:Connect(function()
				rebindingSkillId = skill.Id
				keybindStatusLabel.Text = "Press a key for " .. skill.DisplayName .. " (Esc to cancel)"
				refreshKeybindPanel()
			end)
		end
	end

	buildHotbarSlots = function()
		for _, child in ipairs(hotbar:GetChildren()) do
			if child:IsA("TextButton") then
				child:Destroy()
			end
		end
		table.clear(slotButtons)

		for _, skill in SkillSettings.listOrdered() do
			local slot = Instance.new("TextButton")
			slot.Name = skill.Id
			slot.Size = UDim2.new(0, 64, 0, 64)
			slot.Font = Enum.Font.SourceSansBold
			slot.TextSize = 11
			slot.TextColor3 = Color3.fromRGB(255, 255, 255)
			slot.TextWrapped = true
			slot.AutoButtonColor = true
			slot.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
			slot.Parent = hotbar
			addCorner(slot, 8)
			Instance.new("UIStroke").Parent = slot

			slotButtons[skill.Id] = slot

			slot.MouseButton1Click:Connect(function()
				if not isUnlocked(skill.Id) then
					return
				end
				SkillBarState.setEquipped(skill.Id)
				refreshSlotStyles()
			end)
		end

		if not isUnlocked(SkillBarState.getEquippedId()) then
			for _, skill in SkillSettings.listOrdered() do
				if isUnlocked(skill.Id) then
					SkillBarState.setEquipped(skill.Id)
					break
				end
			end
		end

		refreshSlotStyles()
	end

	buildHotbarSlots()
	refreshKeybindPanel()

	if SkillUnlock then
		SkillUnlock.ensurePlayerDefaults(player)
		player:GetAttributeChangedSignal("UnlockedSkills"):Connect(function()
			SkillUnlock.ensurePlayerDefaults(player)
			buildHotbarSlots()
			refreshSlotStyles()
			if keybindPanel and keybindPanel.Visible then
				refreshKeybindPanel()
			end
		end)
	end

	keybindsButton.MouseButton1Click:Connect(function()
		keybindPanel.Visible = not keybindPanel.Visible
		if keybindPanel.Visible then
			rebindingSkillId = nil
			keybindStatusLabel.Text = "Click a skill, then press a key. Esc cancels. Do not bind F (lock-on)."
			refreshKeybindPanel()
		end
	end)

	closePanelButton.MouseButton1Click:Connect(function()
		keybindPanel.Visible = false
		rebindingSkillId = nil
	end)

	UserInputService.InputBegan:Connect(function(input, _gameProcessed)
		if not rebindingSkillId or not keybindPanel.Visible then
			return
		end
		if input.KeyCode == Enum.KeyCode.Escape then
			rebindingSkillId = nil
			keybindStatusLabel.Text = "Rebind cancelled."
			refreshKeybindPanel()
			return
		end
		if input.UserInputType == Enum.UserInputType.Keyboard and input.KeyCode ~= Enum.KeyCode.Unknown then
			if input.KeyCode == Enum.KeyCode.F then
				keybindStatusLabel.Text = "F is lock-on — pick another key."
				return
			end
			local skill = SkillSettings.get(rebindingSkillId)
			SkillBarState.setKeybind(rebindingSkillId, input.KeyCode)
			local label = SkillBarState.keyCodeToLabel(input.KeyCode)
			if skill then
				keybindStatusLabel.Text = skill.DisplayName .. " bound to [" .. label .. "]"
			end
			rebindingSkillId = nil
			refreshKeybindPanel()
			refreshSlotStyles()
		end
	end)

	SkillBarState.onChanged(function(_changeKind, _skillId)
		refreshSlotStyles()
		if keybindPanel.Visible then
			refreshKeybindPanel()
		end
	end)

	task.spawn(function()
		local lastJson = player:GetAttribute("UnlockedSkills")
		while screenGui and screenGui.Parent do
			task.wait(0.5)
			local current = player:GetAttribute("UnlockedSkills")
			if current ~= lastJson then
				lastJson = current
				buildHotbarSlots()
				if keybindPanel.Visible then
					refreshKeybindPanel()
				end
			end
		end
	end)

	local connections: { RBXScriptConnection } = {}

	local function updateBar(fill: Frame, valAttr: string, maxAttr: string, char: Model)
		local val = char:GetAttribute(valAttr) or 0
		local max = char:GetAttribute(maxAttr) or 100
		local ratio = math.clamp(val / max, 0, 1)
		fill:TweenSize(UDim2.new(ratio, 0, 1, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.2, true)
	end

	local function setupCharacter(char: Model)
		for _, conn in connections do
			conn:Disconnect()
		end
		table.clear(connections)

		local function sync()
			updateBar(healthFill, "Health", "MaxHealth", char)
			updateBar(staminaFill, "Stamina", "MaxStamina", char)
			updateBar(reserveFill, "ManaReserve", "MaxManaReserve", char)
			updateBar(activeFill, "ActiveMana", "MaxActiveMana", char)
			exhaustedLabel.Visible = char:GetAttribute("IsExhausted") == true
		end

		for _, attr in {
			"Health", "MaxHealth", "Stamina", "MaxStamina",
			"ManaReserve", "MaxManaReserve", "ActiveMana", "MaxActiveMana", "IsExhausted",
		} do
			table.insert(connections, char:GetAttributeChangedSignal(attr):Connect(sync))
		end
		sync()
	end

	player.CharacterAdded:Connect(setupCharacter)
	if player.Character then
		setupCharacter(player.Character)
	end

	print("[GameplayHUD] Ready —", screenGui.Parent:GetFullName())
end

local GameplayHUDApp = {}

function GameplayHUDApp.start()
	if not _depsOk then
		warn("[GameplayHUD] Skipping HUD — dependencies failed")
		return
	end
	local ok, err = pcall(createHUD)
	if not ok then
		warn("[GameplayHUD] createHUD error:", err)
		showLoadError("createHUD crashed: " .. tostring(err))
	end
end

return GameplayHUDApp
