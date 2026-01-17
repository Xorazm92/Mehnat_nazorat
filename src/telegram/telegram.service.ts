import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot?: Telegraf<any>;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const token =
      this.configService.get<string>('TELEGRAM_BOT_TOKEN') ||
      this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      // No token configured; skip bot startup
      return;
    }
    this.bot = new Telegraf(token);
    this.setupBot();
    await this.bot.launch();
  }

  private setupBot() {
    if (!this.bot) return;
    this.bot.start((ctx) =>
      ctx.reply(
        '👋 Welcome to NBT Inspection Bot! Type /help to see commands.',
      ),
    );
    this.bot.help((ctx) => ctx.reply('Commands: /start, /help'));
  }
}
