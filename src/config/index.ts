import * as dotenv from 'dotenv';
dotenv.config();

const must = (key: string, fallbacks: string[] = []): string => {
  const keysToCheck = [key, ...fallbacks];
  for (const k of keysToCheck) {
    const value = process.env[k];
    if (value) return value;
  }
  throw new Error(`Missing environment variable: ${keysToCheck.join(' or ')}`);
};

export const config = {
  PORT: Number(process.env.PORT ?? 3000),
  BOT_TOKEN: must('BOT_TOKEN'),
  DB: {
    TYPE: must('DB_TYPE'),
    HOST: process.env.DB_HOST ?? '',
    PORT: Number(process.env.DB_PORT ?? 5432),
    USER: must('DB_USER'),
    PASSWORD: must('DB_PASSWORD'),
    NAME: must('DB_NAME', ['DB_BAZE']),
  },
  ADMIN_ID: must('ADMIN_ID'),
};
