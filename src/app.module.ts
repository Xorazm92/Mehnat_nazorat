import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { HealthModule } from './health.module';

@Module({
  imports: [TelegramModule, HealthModule],
})
export class AppModule {}
