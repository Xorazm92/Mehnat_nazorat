import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from 'src/config';
import { BotModule } from './bot/bot.module';
import { CacheConfigModule } from './cache.module';
import { SchedulerModule } from './bot/scheduler/scheduler.module';
import { OrganizationController } from './organization.controller';
import { PlanController } from './plan.controller';
import { ComplianceController } from './compliance.controller';
import { InventoryController } from './inventory.controller';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(
      config.DB_TYPE === 'sqlite'
        ? {
            type: 'sqlite',
            database: config.DB_BAZE,
            synchronize: true,
            entities: [__dirname + '/../core/entity/*.entity{.ts,.js}'],
          }
        : {
            type: config.DB_TYPE as any,
            host: config.DB_HOST,
            port: config.DB_PORT,
            username: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_BAZE,
            synchronize: true,
            entities: [__dirname + '/../core/entity/*.entity{.ts,.js}'],
            ssl: config.DB_TYPE === 'postgres' ? { rejectUnauthorized: false } : false,
          },
    ),
    CacheConfigModule,
    BotModule,
    SchedulerModule,
    CoreModule,
  ],
  controllers: [
    OrganizationController,
    PlanController,
    ComplianceController,
    InventoryController,
  ],
})
export class AppModule {}
