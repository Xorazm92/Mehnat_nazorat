import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface DatabaseConfig {
  type: 'postgres' | 'sqlite';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  name: string;
  synchronize: boolean;
  ssl?: boolean;
}

export const databaseConfig = registerAs('database', (): DatabaseConfig => {
  const config = {
    type: (process.env.DB_TYPE as 'postgres' | 'sqlite') || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'nbt_aloqa_bot',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    ssl: process.env.DB_SSL === 'true',
  };

  // For SQLite, only name is required
  if (config.type === 'sqlite') {
    return {
      type: 'sqlite',
      name: config.name,
      synchronize: true,
    };
  }

  return config;
});

export const databaseValidationSchema = Joi.object({
  DB_TYPE: Joi.string().valid('postgres', 'sqlite').default('postgres'),
  DB_HOST: Joi.string().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DB_PORT: Joi.number().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DB_USER: Joi.string().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DB_PASSWORD: Joi.string().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_SSL: Joi.boolean().default(false),
});
