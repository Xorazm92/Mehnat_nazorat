import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ComplianceStatus } from 'src/core/entity/compliance-check.entity';

export class CreateComplianceItemDto {
  @IsString()
  @IsNotEmpty()
  article_number: string;

  @IsString()
  @IsNotEmpty()
  requirement: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsEnum(['MANDATORY', 'RECOMMENDED'])
  severity?: 'MANDATORY' | 'RECOMMENDED';
}

export class UpdateComplianceItemDto extends PartialType(
  CreateComplianceItemDto,
) {}

export class CreateComplianceCheckDto {
  @IsUUID()
  task_id: string;

  @IsUUID()
  compliance_item_id: string;

  @IsOptional()
  @IsEnum(ComplianceStatus)
  status?: ComplianceStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateComplianceCheckDto extends PartialType(
  CreateComplianceCheckDto,
) {}

export class MarkComplianceDto {
  @IsString()
  @IsNotEmpty()
  checkedBy: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  evidenceFileId?: string;
}
