import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface TelegramConfig {
  token: string;
  webhookUrl?: string;
  adminChatId?: string;
  rateLimiting: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
}

export const telegramConfig = registerAs(
  'telegram',
  (): TelegramConfig => ({
    token: process.env.TELEGRAM_BOT_TOKEN || '',
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL,
    adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID,
    rateLimiting: {
      enabled: process.env.TELEGRAM_RATE_LIMIT_ENABLED !== 'false',
      windowMs: parseInt(
        process.env.TELEGRAM_RATE_LIMIT_WINDOW_MS || '60000',
        10,
      ),
      maxRequests: parseInt(
        process.env.TELEGRAM_RATE_LIMIT_MAX_REQUESTS || '30',
        10,
      ),
    },
  }),
);

export const telegramValidationSchema = Joi.object({
  TELEGRAM_BOT_TOKEN: Joi.string().required(),
  TELEGRAM_WEBHOOK_URL: Joi.string().uri().optional(),
  TELEGRAM_ADMIN_CHAT_ID: Joi.string().optional(),
  TELEGRAM_RATE_LIMIT_ENABLED: Joi.boolean().default(true),
  TELEGRAM_RATE_LIMIT_WINDOW_MS: Joi.number().default(60000),
  TELEGRAM_RATE_LIMIT_MAX_REQUESTS: Joi.number().default(30),
});
