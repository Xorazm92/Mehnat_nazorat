import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salary } from '../entity/salary.entity';
import { Statistics } from '../entity/statistics.entity';
import { SalaryService } from '../services/salary.service';
import { StatisticsService } from '../services/statistics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Salary, Statistics])],
  providers: [SalaryService, StatisticsService],
  exports: [SalaryService, StatisticsService, TypeOrmModule],
})
export class SalaryModule {}
