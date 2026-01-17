import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { databaseConfig, databaseValidationSchema } from './database.config';
import { telegramConfig, telegramValidationSchema } from './telegram.config';
import { redisConfig, redisValidationSchema } from './redis.config';
import {
  validationConfig,
  validationValidationSchema,
} from './validation.config';

export const configuration = () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    environment: process.env.NODE_ENV ?? 'development',
    apiPrefix: process.env.API_PREFIX ?? '/api',
    apiVersion: process.env.API_VERSION ?? 'v1',
  },
  security: {
    apiKey: process.env.API_KEY ?? '',
    jwtSecret: process.env.JWT_SECRET ?? 'default-secret',
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME ?? '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL ?? 'info',
    enableFileLogging: process.env.ENABLE_FILE_LOGGING !== 'false',
    logDirectory: process.env.LOG_DIRECTORY ?? 'logs',
  },
});

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_PREFIX: Joi.string().default('/api'),
  API_VERSION: Joi.string().default('v1'),
  API_KEY: Joi.string().min(16).required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRATION_TIME: Joi.string().default('24h'),
  BCRYPT_ROUNDS: Joi.number().default(10),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('info'),
  ENABLE_FILE_LOGGING: Joi.boolean().default(true),
  LOG_DIRECTORY: Joi.string().default('logs'),
})
  .concat(databaseValidationSchema)
  .concat(telegramValidationSchema)
  .concat(redisValidationSchema)
  .concat(validationValidationSchema);

export type AppConfig = ReturnType<typeof configuration>;
export type AppConfigService = ConfigService<AppConfig>;

export { databaseConfig, telegramConfig, redisConfig, validationConfig };
