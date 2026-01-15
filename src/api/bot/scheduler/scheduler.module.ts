import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PlanScheduler } from './plan.scheduler';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [ScheduleModule.forRoot(), CoreModule],
  providers: [PlanScheduler],
})
export class SchedulerModule {}
