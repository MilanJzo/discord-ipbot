# Discord IP Bot

A simple Discord bot that provides server information through slash commands.

## Features

-   `/test` - Basic test command that responds with "hello world"
-   `/serverip` - Get the public IP address of the server this bot is running on

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your Discord app credentials:

```env
APP_ID=your_app_id
PUBLIC_KEY=your_public_key
DISCORD_TOKEN=your_bot_token
```

3. Register the slash commands:

```bash
npm run register
```

4. Start the bot:

```bash
npm start
```

## Development

For development with auto-restart:

```bash
npm run dev
```

## Deployment

This bot uses HTTP interactions and requires a public endpoint. Set up your Discord app's Interactions Endpoint URL to point to `https://your-domain.com/interactions`.

## Note

This bot appears "offline" in Discord because it uses HTTP interactions rather than a persistent Gateway connection. It will still respond to slash commands normally.
