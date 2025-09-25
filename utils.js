import "dotenv/config";

export async function DiscordRequest(endpoint, options) {
	// append endpoint to root API URL
	const url = "https://discord.com/api/v10/" + endpoint;
	// Stringify payloads
	if (options.body) options.body = JSON.stringify(options.body);
	// Use fetch to make requests
	const res = await fetch(url, {
		headers: {
			Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
			"Content-Type": "application/json; charset=UTF-8",
			"User-Agent": "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
		},
		...options,
	});
	// throw API errors
	if (!res.ok) {
		const data = await res.json();
		console.log(res.status);
		throw new Error(JSON.stringify(data));
	}
	// return original response
	return res;
}

export async function InstallGlobalCommands(appId, commands) {
	// API endpoint to overwrite global commands
	const endpoint = `applications/${appId}/commands`;

	try {
		// This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
		await DiscordRequest(endpoint, { method: "PUT", body: commands });
	} catch (err) {
		console.error(err);
	}
}

// Function to get the server's public IP address
export async function getServerIP() {
	try {
		const response = await fetch("https://api.ipify.org?format=json");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data.ip;
	} catch (error) {
		console.error("Error fetching server IP:", error);
		// Fallback to a different service if ipify fails
		try {
			const fallbackResponse = await fetch("https://httpbin.org/ip");
			if (!fallbackResponse.ok) {
				throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
			}
			const fallbackData = await fallbackResponse.json();
			return fallbackData.origin.split(",")[0]; // httpbin might return multiple IPs
		} catch (fallbackError) {
			console.error("Error with fallback IP service:", fallbackError);
			throw new Error("Unable to determine server IP address");
		}
	}
}
