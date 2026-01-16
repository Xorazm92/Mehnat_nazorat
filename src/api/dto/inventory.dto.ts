import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { InventoryType } from 'src/core/entity/inventory.entity';

export class CreateInventoryItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(InventoryType)
  type: InventoryType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  min_threshold?: number;
}

export class UpdateInventoryItemDto extends PartialType(
  CreateInventoryItemDto,
) {}

export class IssueInventoryDto {
  @IsUUID()
  inventoryItemId: string;

  @IsUUID()
  userId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  issuedBy: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReturnInventoryDto {
  @IsUUID()
  inventoryItemId: string;

  @IsUUID()
  userId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class DamagedInventoryDto {
  @IsUUID()
  inventoryItemId: string;

  @IsUUID()
  userId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
