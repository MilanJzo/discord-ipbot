# Discord IP Bot

A simple Discord bot that provides server information through slash commands.

## Note

This bot appears "offline" in Discord because it uses HTTP interactions rather than a persistent Gateway connection. It will still respond to slash commands normally.

## Features

-   `/test` - Basic test command that responds with "hello world"
-   `/serverip` - Get the public IP address of the server this bot is running on

## Prerequisites

Before setting up the bot, you need:

1. **Discord Application**: Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. **Bot Permissions**: Configure your bot with these permissions:
    - `applications.commands` (for slash commands)
    - `bot` scope
3. **Node.js**: Version 18+ (for local development)
4. **Docker**: Docker Desktop (for containerized deployment)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/MilanJzo/discord-ipbot.git
```

2. Install dependencies:

```bash
cd discord-ipbot
npm install
```

3. Create a `.env` file with your Discord app credentials:

```env
APP_ID=your_app_id
PUBLIC_KEY=your_public_key
DISCORD_TOKEN=your_bot_token
```

4. Register the slash commands:

```bash
npm run register
```

5. Start the bot (with docker):

```bash
docker-compose up --build -d
```

### Docker Commands

```bash
# View logs
docker-compose logs -f discord-bot

# Stop the bot
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

## Deployment

This bot uses HTTP interactions and requires a public endpoint. Set up your Discord app's Interactions Endpoint URL to point to `https://your-domain.com/interactions`.

### Setting up Interactions Endpoint

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to **General Information**
4. Set **Interactions Endpoint URL** to: `https://your-domain.com/interactions`
5. Discord will verify the endpoint - make sure your bot is running and accessible

## Troubleshooting

### Common Issues

1. **Bot appears offline**: This is normal for HTTP interaction bots
2. **Commands not working**: Ensure you've run `npm run register` and set the correct Interactions Endpoint URL
3. **403 Forbidden**: Check your `PUBLIC_KEY` is correct
4. **Health check failing**: Ensure port 3000 is accessible

### Debug Commands

```bash
# Check bot health
curl http://localhost:3000/health

# View Docker logs
docker-compose logs -f discord-bot

# Test slash command registration
npm run register
```
