import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnualPlan } from '../entity/annual-plan.entity';
import { MonthlyPlan } from '../entity/monthly-plan.entity';
import { PlanItem } from '../entity/plan-item.entity';
import { PlanService } from '../services/plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnnualPlan, MonthlyPlan, PlanItem])],
  providers: [PlanService],
  exports: [PlanService, TypeOrmModule],
})
export class PlanModule {}
