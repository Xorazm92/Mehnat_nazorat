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
import { Facility } from './entity/facility.entity';
import { ResponsibilityMatrix } from './entity/responsibility-matrix.entity';
import { AnnualPlan } from './entity/annual-plan.entity';
import { MonthlyPlan } from './entity/monthly-plan.entity';
import { PlanItem } from './entity/plan-item.entity';
import { ComplianceItem } from './entity/compliance-item.entity';
import { ComplianceCheck } from './entity/compliance-check.entity';
import { InventoryItem } from './entity/inventory.entity';
import { IssuanceLog } from './entity/issuance-log.entity';
import { Campaign } from './entity/campaign.entity';
import { CampaignAction } from './entity/campaign-action.entity';
import { TaskService } from './services/task.service';
import { ReportService } from './services/report.service';
import { SalaryService } from './services/salary.service';
import { StatisticsService } from './services/statistics.service';
import { MessageService } from './services/message.service';
import { OrganizationService } from './services/organization.service';
import { PlanService } from './services/plan.service';
import { ComplianceService } from './services/compliance.service';
import { InventoryService } from './services/inventory.service';

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
      Facility,
      ResponsibilityMatrix,
      AnnualPlan,
      MonthlyPlan,
      PlanItem,
      ComplianceItem,
      ComplianceCheck,
      InventoryItem,
      IssuanceLog,
      Campaign,
      CampaignAction,
    ]),
  ],
  providers: [
    TaskService,
    ReportService,
    SalaryService,
    StatisticsService,
    MessageService,
    OrganizationService,
    PlanService,
    ComplianceService,
    InventoryService,
  ],
  exports: [
    TaskService,
    ReportService,
    SalaryService,
    StatisticsService,
    MessageService,
    OrganizationService,
    PlanService,
    ComplianceService,
    InventoryService,
    TypeOrmModule,
  ],
})
export class CoreModule {}
