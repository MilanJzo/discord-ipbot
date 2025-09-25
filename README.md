# Discord IP Bot

A simple Discord bot that provides server information through slash commands.

## Note

This bot appears "offline" in Discord because it uses HTTP interactions rather than a persistent Gateway connection. It will still respond to slash commands normally.

## Features

-   `/test` - Basic test command that responds with "hello world"
-   `/about` - Information about the bot, its purpose, features, and technology stack
-   `/version` - Displays the bot version, Node.js version, platform, OS release
-   `/stats` - View bot statistics and performance metrics
-   `/serverip` - Get the public IP address of the server this bot is running on

## Setup

1. Download the Docker image from [Releases](https://github.com/MilanJzo/discord-ipbot/releases)

2. Load the image:

```bash
docker load -i discord-ipbot-image.tar

```

3. Run the image:

```bash
docker run -d -p 3000:3000 --env-file .env discord-ipbot:latest

```

## Troubleshooting

### Common Issues

1. **Bot appears offline**: This is normal for HTTP interaction bots
2. **Health check failing**: Ensure port 3000 is accessible

### Debug Commands

```bash
# Check bot health
curl http://localhost:3000/health

# View Docker logs
docker-compose logs -f discord-bot
```
