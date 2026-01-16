import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../entity/organization.entity';
import { Facility } from '../entity/facility.entity';
import { ResponsibilityMatrix } from '../entity/responsibility-matrix.entity';
import { OrganizationService } from '../services/organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, Facility, ResponsibilityMatrix]),
  ],
  providers: [OrganizationService],
  exports: [OrganizationService, TypeOrmModule],
})
export class OrganizationModule {}
