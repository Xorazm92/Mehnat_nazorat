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
import { Organization } from './entity/organization.entity';
import { ReportSubmission } from './entity/report-submission.entity';
import { ReportHistory } from './entity/report-history.entity';
import { Deadline } from './entity/deadline.entity';
import { Inspection } from './entity/inspection.entity';
import { Notification } from './entity/notification.entity';
import { FileArchive } from './entity/file-archive.entity';
import { TaskService } from './services/task.service';
import { ReportService } from './services/report.service';
import { SalaryService } from './services/salary.service';
import { StatisticsService } from './services/statistics.service';
import { MessageService } from './services/message.service';
import { OrganizationService } from './services/organization.service';
import { ReportSubmissionService } from './services/report-submission.service';
import { DeadlineService } from './services/deadline.service';
import { NotificationService } from './services/notification.service';

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
      Organization,
      ReportSubmission,
      ReportHistory,
      Deadline,
      Inspection,
      Notification,
      FileArchive,
    ]),
  ],
  providers: [
    TaskService,
    ReportService,
    SalaryService,
    StatisticsService,
    MessageService,
    OrganizationService,
    ReportSubmissionService,
    DeadlineService,
    NotificationService,
  ],
  exports: [
    TaskService,
    ReportService,
    SalaryService,
    StatisticsService,
    MessageService,
    OrganizationService,
    ReportSubmissionService,
    DeadlineService,
    NotificationService,
    TypeOrmModule,
  ],
})
export class CoreModule {}
