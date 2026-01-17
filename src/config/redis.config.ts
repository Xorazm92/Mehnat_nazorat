import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  ttl: {
    default: number;
    user: number;
    session: number;
    cache: number;
  };
}

export const redisConfig = registerAs(
  'redis',
  (): RedisConfig => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'nbt:',
    ttl: {
      default: parseInt(process.env.REDIS_TTL_DEFAULT || '3600', 10),
      user: parseInt(process.env.REDIS_TTL_USER || '86400', 10),
      session: parseInt(process.env.REDIS_TTL_SESSION || '7200', 10),
      cache: parseInt(process.env.REDIS_TTL_CACHE || '1800', 10),
    },
  }),
);

export const redisValidationSchema = Joi.object({
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_DB: Joi.number().default(0),
  REDIS_KEY_PREFIX: Joi.string().default('nbt:'),
  REDIS_TTL_DEFAULT: Joi.number().default(3600),
  REDIS_TTL_USER: Joi.number().default(86400),
  REDIS_TTL_SESSION: Joi.number().default(7200),
  REDIS_TTL_CACHE: Joi.number().default(1800),
});
