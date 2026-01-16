import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entity/task.entity';
import { Report } from '../entity/report.entity';
import { TaskService } from '../services/task.service';
import { ReportService } from '../services/report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Report])],
  providers: [TaskService, ReportService],
  exports: [TaskService, ReportService, TypeOrmModule],
})
export class TaskModule {}
