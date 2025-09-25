import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

// Simple test command
const TEST_COMMAND = {
	name: "test",
	description: "Basic command",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

// Command to get server IP
const IP_COMMAND = {
	name: "serverip",
	description: "Get the public IP address of the server this bot is running on",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const ALL_COMMANDS = [TEST_COMMAND, IP_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
