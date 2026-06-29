# HavenBot Pro

A modular Discord community bot built for Haven.

## Current Features

- `/install-haven` server setup
- `/setup-colour-roles`
- `/setup-optional-pings`
- `/post-custom` popup form announcement
- `/post-update`
- `/verify`
- `/ticket`
- `/close-ticket`
- `/revive-chat`
- `/revive-vc`
- `/daily-question`
- `/giveaway`
- `/timeout-user`

## Project Structure

```text
src/
  commands/
  events/
  features/
  utils/
  config/
```

## Local Setup

```bash
npm install
npm run deploy
npm start
```

## Railway Setup

1. Upload this project to GitHub.
2. Deploy the GitHub repository on Railway.
3. Add environment variables:

```env
DISCORD_TOKEN=your_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
```

4. Railway start command should be:

```bash
npm start
```

5. Run slash command deploy once locally or in Railway shell:

```bash
npm run deploy
```

## Important

Do not upload `.env` to GitHub.

Only run one copy of the bot at once.
