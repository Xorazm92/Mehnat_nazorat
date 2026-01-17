Patch 1 summary:

- Bot MVP integrated
- Reads TELEGRAM_BOT_TOKEN or BOT_TOKEN from ENV
- Starts Telegraf bot on module init
- Adds basic /start and /help commands
- Development mode long-polling via Telegraf

Next steps:

- Bind bot to REST /users by telegram_id to fetch profile
- Add tests and expand commands

How to test:

- curl http://localhost:8008/health
- Interact with bot in Telegram (requires bot token and chat)
