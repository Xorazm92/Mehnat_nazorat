import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './api/app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  console.log('Starting application...');
  try {
    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              winston.format.colorize(),
              winston.format.printf(({ timestamp, level, message, ms }) => {
                return `${timestamp} ${level}: ${message} ${ms}`;
              }),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
          }),
        ],
      }),
    });

    // Global ValidationPipe - barcha input ma'lumotlarni validatsiya qiladi
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // DTO da yo'q fieldlarni olib tashlaydi
        forbidNonWhitelisted: true, // Noma'lum fieldlar kelsa xato qaytaradi
        transform: true, // Input ma'lumotlarni DTO typega aylantiradi
        transformOptions: {
          enableImplicitConversion: true, // String -> Number avtomatik konvertatsiya
        },
      }),
    );

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Fatal Error during startup:', error);
    process.exit(1);
  }
}

bootstrap();
