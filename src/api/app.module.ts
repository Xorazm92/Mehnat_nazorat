import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { CacheConfigModule } from './cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const ssl = false; // local uchun SSL o‘chiq

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            synchronize: true, // Eslatma: Prod-da buni false qilish va migratsiya ishlatish tavsiya etiladi
            entities: [__dirname + '/../core/entity/*.entity{.ts,.js}'],
            ssl,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: Number(configService.get<string>('DB_PORT') || 5432),
          username: configService.get<string>('DB_USER') || 'nbt_user',
          password: configService.get<string>('DB_PASSWORD') || 'StrongPass_123',
          database: configService.get<string>('DB_NAME') || 'nbt_aloqa',
          synchronize: true, // Eslatma: Prod-da buni false qilish va migratsiya ishlatish tavsiya etiladi
          entities: [__dirname + '/../core/entity/*.entity{.ts,.js}'],
          ssl,
        };
      },
      inject: [ConfigService],
    }),
    CacheConfigModule,
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

