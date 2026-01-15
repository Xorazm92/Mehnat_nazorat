import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { Report } from './entity/report.entity';
import { Salary } from './entity/salary.entity';
import { Statistics } from './entity/statistics.entity';
import { Message } from './entity/message.entity';
import { User } from './entity/user.entity';
import { Appeals } from './entity/appeal.entity';
import { Department } from './entity/departments.entity';
import { TaskService } from './services/task.service';
import { ReportService } from './services/report.service';
import { SalaryService } from './services/salary.service';
import { StatisticsService } from './services/statistics.service';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Report,
      Salary,
      Statistics,
      Message,
      User,
      Appeals,
      Department,
    ]),
  ],
  providers: [
    TaskService,
    ReportService,
    SalaryService,
    StatisticsService,
    MessageService,
  ],
  exports: [
    TaskService,
    ReportService,
    SalaryService,
    StatisticsService,
    MessageService,
    TypeOrmModule,
  ],
})
export class CoreModule {}
