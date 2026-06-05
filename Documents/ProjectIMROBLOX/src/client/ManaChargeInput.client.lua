local UserInputService = game:GetService("UserInputService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local ToggleManaCharge = ReplicatedStorage:WaitForChild("ToggleManaCharge") :: RemoteEvent
local CHARGE_KEY = Enum.KeyCode.C

local function onInputBegan(input: InputObject, gameProcessed: boolean)
	if gameProcessed then
		return
	end
	if input.KeyCode == CHARGE_KEY then
		print("[ManaChargeInput] Start charging")
		ToggleManaCharge:FireServer(true)
	end
end

local function onInputEnded(input: InputObject, _gameProcessed: boolean)
	if input.KeyCode == CHARGE_KEY then
		print("[ManaChargeInput] Stop charging")
		ToggleManaCharge:FireServer(false)
	end
end

UserInputService.InputBegan:Connect(onInputBegan)
UserInputService.InputEnded:Connect(onInputEnded)
