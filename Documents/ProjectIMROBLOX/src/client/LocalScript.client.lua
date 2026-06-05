-- Loads movement modules from ReplicatedStorage (Studio-synced assets, not Rojo src).
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local gameplay = ReplicatedStorage:FindFirstChild("Gameplay")
if not gameplay then
	warn("[LocalScript] ReplicatedStorage.Gameplay not found — sync movement assets in Studio or add them to default.project.json")
	return
end

local movementScripts = gameplay:WaitForChild("Movement"):WaitForChild("Scripts")

local CameraController = require(movementScripts:WaitForChild("CameraController"))
local MovementController = require(movementScripts:WaitForChild("MovementController"))

CameraController.Start()
MovementController.Start()
