import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceItem } from '../entity/compliance-item.entity';
import { ComplianceCheck } from '../entity/compliance-check.entity';
import { ComplianceService } from '../services/compliance.service';

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceItem, ComplianceCheck])],
  providers: [ComplianceService],
  exports: [ComplianceService, TypeOrmModule],
})
export class ComplianceModule {}
