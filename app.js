import "dotenv/config";
import express from "express";
import { InteractionResponseFlags, InteractionResponseType, InteractionType, MessageComponentTypes, verifyKeyMiddleware } from "discord-interactions";
import { getServerIP } from "./utils.js";
import { readFileSync } from "fs";
import os from "os";

// Read package.json for version info
const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

// Bot statistics tracking
const botStats = {
	startTime: Date.now(),
	commandsExecuted: 0,
	totalInteractions: 0,
	commands: {
		test: 0,
		serverip: 0,
		stats: 0,
		version: 0,
		about: 0,
	},
};

/**
 * Health check endpoint for Docker
 */
app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post("/interactions", verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
	// Interaction id, type and data
	const { id, type, data } = req.body;

	/**
	 * Handle verification requests
	 */
	if (type === InteractionType.PING) {
		return res.send({ type: InteractionResponseType.PONG });
	}

	/**
	 * Handle slash command requests
	 * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
	 */
	if (type === InteractionType.APPLICATION_COMMAND) {
		const { name } = data;

		// Track total interactions and command usage
		botStats.totalInteractions++;
		botStats.commandsExecuted++;
		if (botStats.commands[name] !== undefined) {
			botStats.commands[name]++;
		}

		// "test" command
		if (name === "test") {
			// Send a message into the channel where command was triggered from
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: InteractionResponseFlags.IS_COMPONENTS_V2,
					components: [
						{
							type: MessageComponentTypes.TEXT_DISPLAY,
							content: `hello world !`,
						},
					],
				},
			});
		}

		// "serverip" command
		if (name === "serverip") {
			try {
				// Get the server's public IP address
				const serverIP = await getServerIP();

				return res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						flags: InteractionResponseFlags.IS_COMPONENTS_V2,
						components: [
							{
								type: MessageComponentTypes.TEXT_DISPLAY,
								content: `🌐 Server Public IP: \`${serverIP}\``,
							},
						],
					},
				});
			} catch (error) {
				console.error("Error getting server IP:", error);
				return res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						flags: InteractionResponseFlags.IS_COMPONENTS_V2,
						components: [
							{
								type: MessageComponentTypes.TEXT_DISPLAY,
								content: `❌ Error: Unable to retrieve server IP address. Please try again later.`,
							},
						],
					},
				});
			}
		}

		// "stats" command
		if (name === "stats") {
			const uptime = Date.now() - botStats.startTime;
			const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
			const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

			const memoryUsage = process.memoryUsage();
			const memoryUsedMB = Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100;

			let statsContent = `**Bot Statistics**\n\n`;
			statsContent += `**Uptime:** ${days}d ${hours}h ${minutes}m\n`;
			statsContent += `**Memory Usage:** ${memoryUsedMB} MB\n`;
			statsContent += `**Total Interactions:** ${botStats.totalInteractions}\n`;
			statsContent += `**Commands Executed:** ${botStats.commandsExecuted}\n\n`;
			statsContent += `**Command Usage:**\n`;

			for (const [cmd, count] of Object.entries(botStats.commands)) {
				statsContent += `• \`/${cmd}\`: ${count} times\n`;
			}

			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: InteractionResponseFlags.IS_COMPONENTS_V2,
					components: [
						{
							type: MessageComponentTypes.TEXT_DISPLAY,
							content: statsContent,
						},
					],
				},
			});
		}

		// "version" command
		if (name === "version") {
			const nodeVersion = process.version;
			const platform = os.platform();
			const arch = os.arch();
			const osRelease = os.release();
			const totalMem = Math.round((os.totalmem() / 1024 / 1024 / 1024) * 100) / 100;

			let versionContent = `**Version Information**\n\n`;
			versionContent += `**Bot Version:** ${packageJson.version}\n`;
			versionContent += `**Bot Name:** Discord IP Bot\n`;
			versionContent += `**Node.js:** ${nodeVersion}\n`;
			versionContent += `**Platform:** ${platform} (${arch})\n`;
			versionContent += `**OS Release:** ${osRelease}\n`;
			versionContent += `**System RAM:** ${totalMem} GB\n\n`;
			versionContent += `**Dependencies:**\n`;

			Object.entries(packageJson.dependencies).forEach(([dep, version]) => {
				versionContent += `• ${dep}: ${version}\n`;
			});

			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: InteractionResponseFlags.IS_COMPONENTS_V2,
					components: [
						{
							type: MessageComponentTypes.TEXT_DISPLAY,
							content: versionContent,
						},
					],
				},
			});
		}

		// "about" command
		if (name === "about") {
			let aboutContent = `**About Discord IP Bot**\n\n`;
			aboutContent += `**Purpose:** A simple Discord bot that provides server information through slash commands.\n\n`;
			aboutContent += `**Features:**\n`;
			aboutContent += `• Get server's public IP address\n`;
			aboutContent += `• View bot statistics and performance metrics\n`;
			aboutContent += `• Check bot version and system information\n`;
			aboutContent += `• Health monitoring with Docker support\n\n`;
			aboutContent += `**Technology:**\n`;
			aboutContent += `• Built with Node.js and Express\n`;
			aboutContent += `• Uses Discord HTTP interactions\n`;
			aboutContent += `• Containerized with Docker\n`;
			aboutContent += `• Production-ready with security best practices\n\n`;
			aboutContent += `**Note:** This bot appears "offline" because it uses HTTP interactions rather than a persistent Gateway connection. It will still respond to slash commands normally.\n\n`;
			aboutContent += `**Repository:** https://github.com/MilanJzo/discord-ipbot\n`;
			aboutContent += `**License:** ${packageJson.license}`;

			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: InteractionResponseFlags.IS_COMPONENTS_V2,
					components: [
						{
							type: MessageComponentTypes.TEXT_DISPLAY,
							content: aboutContent,
						},
					],
				},
			});
		}

		console.error(`unknown command: ${name}`);
		return res.status(400).json({ error: "unknown command" });
	}

	console.error("unknown interaction type", type);
	return res.status(400).json({ error: "unknown interaction type" });
});

app.listen(PORT, () => {
	console.log("Listening on port", PORT);
});
