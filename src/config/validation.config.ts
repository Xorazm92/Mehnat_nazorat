import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface ValidationConfig {
  enableGlobalPipes: boolean;
  whitelist: boolean;
  forbidNonWhitelisted: boolean;
  transform: boolean;
  transformOptions: {
    enableImplicitConversion: boolean;
  };
  validationOptions: {
    skipMissingProperties: boolean;
    skipUndefinedProperties: boolean;
  };
}

export const validationConfig = registerAs(
  'validation',
  (): ValidationConfig => ({
    enableGlobalPipes: process.env.VALIDATION_ENABLE_GLOBAL_PIPES !== 'false',
    whitelist: process.env.VALIDATION_WHITELIST !== 'false',
    forbidNonWhitelisted:
      process.env.VALIDATION_FORBID_NON_WHITELISTED !== 'false',
    transform: process.env.VALIDATION_TRANSFORM !== 'false',
    transformOptions: {
      enableImplicitConversion:
        process.env.VALIDATION_ENABLE_IMPLICIT_CONVERSION !== 'false',
    },
    validationOptions: {
      skipMissingProperties:
        process.env.VALIDATION_SKIP_MISSING_PROPERTIES === 'true',
      skipUndefinedProperties:
        process.env.VALIDATION_SKIP_UNDEFINED_PROPERTIES === 'true',
    },
  }),
);

export const validationValidationSchema = Joi.object({
  VALIDATION_ENABLE_GLOBAL_PIPES: Joi.boolean().default(true),
  VALIDATION_WHITELIST: Joi.boolean().default(true),
  VALIDATION_FORBID_NON_WHITELISTED: Joi.boolean().default(true),
  VALIDATION_TRANSFORM: Joi.boolean().default(true),
  VALIDATION_ENABLE_IMPLICIT_CONVERSION: Joi.boolean().default(true),
  VALIDATION_SKIP_MISSING_PROPERTIES: Joi.boolean().default(false),
  VALIDATION_SKIP_UNDEFINED_PROPERTIES: Joi.boolean().default(false),
});
