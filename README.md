# Discord IP Bot

A simple Discord bot that provides server information through slash commands.

## Note

This bot appears "offline" in Discord because it uses HTTP interactions rather than a persistent Gateway connection. It will still respond to slash commands normally.

## Features

-   `/test` - Basic test command that responds with "hello world"
-   `/serverip` - Get the public IP address of the server this bot is running on

## Setup

1. download the docker image from [Releases](https://github.com/milanjzo/discord-ip-bot/releases)

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
