import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';
import { BotModule } from './bot/bot.module';
import { CacheConfigModule } from './cache.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: config.DB_TYPE as any,
      host: config.DB_HOST,
      port: config.DB_PORT,
      username: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_BAZE,
      synchronize: true, // Eslatma: Prod-da buni false qilish va migratsiya ishlatish tavsiya etiladi
      entities: [__dirname + '/../core/entity/*.entity{.ts,.js}'],
      // Postgres (Supabase) uchun SSL sozlamasi
      ssl:
        config.DB_TYPE === 'postgres' ? { rejectUnauthorized: false } : false,
    }),
    CacheConfigModule,
    BotModule,
  ],
})
export class AppModule {}
