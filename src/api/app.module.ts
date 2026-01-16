import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { CacheConfigModule } from './cache.module';
import { SchedulerModule } from './bot/scheduler/scheduler.module';
import { OrganizationController } from './organization.controller';
import { PlanController } from './plan.controller';
import { ComplianceController } from './compliance.controller';
import { InventoryController } from './inventory.controller';
import { CoreModule } from 'src/core/core.module';
import { AppConfig, configuration, validationSchema } from 'src/config';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => {
        const dbConfig = configService.get('database', { infer: true });
        const entities = [__dirname + '/../core/entity/*.entity{.ts,.js}'];
        const isSqlite = dbConfig?.type === 'sqlite';

        if (isSqlite) {
          return {
            type: 'sqlite' as const,
            database: dbConfig?.name,
            synchronize: true,
            entities,
          };
        }

        return {
          type: (dbConfig?.type ?? 'postgres') as 'postgres',
          host: dbConfig?.host,
          port: dbConfig?.port,
          username: dbConfig?.user,
          password: dbConfig?.password,
          database: dbConfig?.name,
          synchronize: false,
          entities,
          ssl:
            dbConfig?.type === 'postgres'
              ? { rejectUnauthorized: false }
              : false,
        };
      },
    }),
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
