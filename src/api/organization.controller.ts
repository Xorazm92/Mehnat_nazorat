import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrganizationService } from 'src/core/services/organization.service';
import { ResponsibilityMatrix } from 'src/core/entity/responsibility-matrix.entity';
import {
  CreateFacilityDto,
  CreateOrganizationDto,
  CreateResponsibilityDto,
  UpdateFacilityDto,
  UpdateOrganizationDto,
  UpdateResponsibilityDto,
} from './dto/organization.dto';

@Controller('api/organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // Organization Endpoints
  @Post()
  async createOrganization(@Body() dto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(dto);
  }

  @Get()
  async getAllOrganizations() {
    return this.organizationService.getAllOrganizations();
  }

  @Get(':id')
  async getOrganizationById(@Param('id') id: string) {
    return this.organizationService.getOrganizationById(id);
  }

  @Put(':id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationService.updateOrganization(id, dto);
  }

  // Facility Endpoints
  @Post(':orgId/facilities')
  async createFacility(
    @Param('orgId') orgId: string,
    @Body() dto: CreateFacilityDto,
  ) {
    return this.organizationService.createFacility({
      ...dto,
      organization_id: orgId,
    });
  }

  @Get(':orgId/facilities')
  async getFacilitiesByOrganization(@Param('orgId') orgId: string) {
    return this.organizationService.getFacilitiesByOrganization(orgId);
  }

  @Get('facilities/:facilityId')
  async getFacilityById(@Param('facilityId') facilityId: string) {
    return this.organizationService.getFacilityById(facilityId);
  }

  @Put('facilities/:facilityId')
  async updateFacility(
    @Param('facilityId') facilityId: string,
    @Body() dto: UpdateFacilityDto,
  ) {
    return this.organizationService.updateFacility(facilityId, dto);
  }

  // Responsibility Matrix Endpoints
  @Post('responsibilities')
  async addResponsible(@Body() dto: CreateResponsibilityDto) {
    const payload: Partial<ResponsibilityMatrix> = {
      ...dto,
      effective_from: new Date(dto.effective_from),
      effective_to: dto.effective_to ? new Date(dto.effective_to) : undefined,
      status: dto.status ?? 'ACTIVE',
    };
    return this.organizationService.addResponsible(payload);
  }

  @Get('facilities/:facilityId/responsibilities')
  async getResponsibilitiesByFacility(@Param('facilityId') facilityId: string) {
    return this.organizationService.getResponsibilitiesByFacility(facilityId);
  }

  @Get('users/:userId/responsibilities')
  async getResponsibilitiesByUser(@Param('userId') userId: string) {
    return this.organizationService.getResponsibilitiesByUser(userId);
  }

  @Put('responsibilities/:id')
  async updateResponsibility(
    @Param('id') id: string,
    @Body() dto: UpdateResponsibilityDto,
  ) {
    const payload: Partial<ResponsibilityMatrix> = {
      ...dto,
      effective_from: dto.effective_from
        ? new Date(dto.effective_from)
        : undefined,
      effective_to: dto.effective_to ? new Date(dto.effective_to) : undefined,
    };
    return this.organizationService.updateResponsibility(id, payload);
  }

  @Put('responsibilities/:id/deactivate')
  async deactivateResponsibility(@Param('id') id: string) {
    await this.organizationService.deactivateResponsibility(id);
    return { message: 'Responsibility deactivated' };
  }
}
