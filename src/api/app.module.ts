import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';
import { BotModule } from './bot/bot.module';
import { CacheConfigModule } from './cache.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: config.DB.TYPE as any,
      host: config.DB.HOST || undefined,
      port: config.DB.PORT,
      username: config.DB.USER,
      password: config.DB.PASSWORD,
      database: config.DB.NAME,
      synchronize: true, // Eslatma: Prod-da buni false qilish va migratsiya ishlatish tavsiya etiladi
      entities: [__dirname + '/../core/entity/*.entity{.ts,.js}'],
      // Postgres (Supabase) uchun SSL sozlamasi
      ssl:
        config.DB.TYPE === 'postgres' ? { rejectUnauthorized: false } : false,
    }),
    CacheConfigModule,
    BotModule,
  ],
})
export class AppModule {}
