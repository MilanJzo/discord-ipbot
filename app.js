import "dotenv/config";
import express from "express";
import { InteractionResponseFlags, InteractionResponseType, InteractionType, MessageComponentTypes, verifyKeyMiddleware } from "discord-interactions";
import { getServerIP } from "./utils.js";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

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

		console.error(`unknown command: ${name}`);
		return res.status(400).json({ error: "unknown command" });
	}

	console.error("unknown interaction type", type);
	return res.status(400).json({ error: "unknown interaction type" });
});

app.listen(PORT, () => {
	console.log("Listening on port", PORT);
});
