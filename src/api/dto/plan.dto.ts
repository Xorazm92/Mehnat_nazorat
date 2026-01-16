import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApprovalStatus, PlanType } from 'src/core/entity/annual-plan.entity';
import { MonthlyPlanStatus } from 'src/core/entity/monthly-plan.entity';
import { PlanItemStatus } from 'src/core/entity/plan-item.entity';

export class CreateAnnualPlanDto {
  @IsUUID()
  organization_id: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsEnum(PlanType)
  type: PlanType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateAnnualPlanDto extends PartialType(CreateAnnualPlanDto) {
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approval_status?: ApprovalStatus;
}

export class ApprovePlanDto {
  @IsString()
  @IsNotEmpty()
  approvedBy: string;
}

export class CreateMonthlyPlanDto {
  @IsUUID()
  annual_plan_id: string;

  @IsUUID()
  facility_id: string;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsOptional()
  @IsEnum(MonthlyPlanStatus)
  status?: MonthlyPlanStatus;

  @IsOptional()
  @IsDateString()
  due_date?: string;
}

export class UpdateMonthlyPlanDto extends PartialType(CreateMonthlyPlanDto) {}

export class CreatePlanItemDto {
  @IsUUID()
  monthly_plan_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  normative_reference: string;

  @IsOptional()
  @IsString()
  assigned_to?: string;

  @IsDateString()
  due_date: string;
}

export class UpdatePlanItemDto extends PartialType(CreatePlanItemDto) {
  @IsOptional()
  @IsEnum(PlanItemStatus)
  status?: PlanItemStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  completion_percentage?: number;
}

export class CompletePlanItemDto {
  @IsString()
  @IsNotEmpty()
  completedBy: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  completionPercentage: number;
}

export class GenerateMonthlyPlansDto {
  @IsUUID()
  annualPlanId: string;
}
