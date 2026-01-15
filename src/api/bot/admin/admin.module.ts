import { Module } from '@nestjs/common';
import { AdminCommands } from './update/commands';
import { AddDepartmentScene } from './update/scenes/add-department-scene';
import { AddChildDepartmentScene } from './update/scenes/add-child-department.scene';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/core/entity/departments.entity';
import { ButtonsModule } from '../buttons/buttons.module';
import { User } from 'src/core/entity/user.entity';
import { ChangeUsersPhone } from './update/scenes/change-users-phone';
import { GetAppealsFile, GetAppealsText } from './update/scenes/appeal-scene';
import { Appeals } from 'src/core/entity/appeal.entity';
import { ManageUsersActions } from './update/actions/manage-users-actions';
import { AdminMenuActions } from './update/actions/menu-actions';
import { ManageAppealsActions } from './update/actions/manage-appeals-actions';
import { ManageDepartmentsActions } from './update/actions/manage-departments-sctions';
import { CoreModule } from 'src/core/core.module';
import { AnnualPlanApprovalScene } from './update/scenes/annual-plan-approval.scene';
import { ComplianceChecklistScene } from './update/scenes/compliance-checklist.scene';
import { InventoryManagementScene } from './update/scenes/inventory-management.scene';
import { MonthlyPlanApprovalScene } from './update/scenes/monthly-plan-approval.scene';
import { AdminPlanActions } from './update/actions/plan-actions';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, User, Appeals]),
    ButtonsModule,
    CoreModule,
  ],
  providers: [
    AdminCommands,
    AddDepartmentScene,
    AddChildDepartmentScene,
    ChangeUsersPhone,
    GetAppealsFile,
    GetAppealsText,
    ManageAppealsActions,
    ManageDepartmentsActions,
    ManageUsersActions,
    AdminMenuActions,
    AnnualPlanApprovalScene,
    ComplianceChecklistScene,
    InventoryManagementScene,
    MonthlyPlanApprovalScene,
    AdminPlanActions,
  ],
})
export class AdminModule {}
