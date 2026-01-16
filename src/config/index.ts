import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export const configuration = () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  bot: {
    token: process.env.BOT_TOKEN ?? '',
    adminId: process.env.ADMIN_ID ?? '',
  },
  security: {
    apiKey: process.env.API_KEY ?? '',
  },
  database: {
    type: process.env.DB_TYPE ?? 'sqlite',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER ?? '',
    password: process.env.DB_PASSWORD ?? '',
    name: process.env.DB_BAZE ?? '',
  },
});

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  BOT_TOKEN: Joi.string().required(),
  ADMIN_ID: Joi.string().allow('').optional(),
  API_KEY: Joi.string().min(16).required(),
  DB_TYPE: Joi.string().valid('sqlite', 'postgres').default('sqlite'),
  DB_HOST: Joi.string().when('DB_TYPE', {
    is: 'sqlite',
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().required(),
  }),
  DB_PORT: Joi.number()
    .integer()
    .when('DB_TYPE', {
      is: 'sqlite',
      then: Joi.number().optional(),
      otherwise: Joi.number().required(),
    }),
  DB_USER: Joi.string().when('DB_TYPE', {
    is: 'sqlite',
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_TYPE', {
    is: 'sqlite',
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().required(),
  }),
  DB_BAZE: Joi.string().required(),
});

export type AppConfig = ReturnType<typeof configuration>;
export type AppConfigService = ConfigService<AppConfig>;
