import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entity/organization.entity';
import { Facility } from '../entity/facility.entity';
import { ResponsibilityMatrix } from '../entity/responsibility-matrix.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
    @InjectRepository(ResponsibilityMatrix)
    private responsibilityMatrixRepository: Repository<ResponsibilityMatrix>,
  ) {}

  // Organization Methods
  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    const org = this.organizationRepository.create(data);
    return this.organizationRepository.save(org);
  }

  async getOrganizationById(id: string): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['facilities'],
    });
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: ['facilities'],
    });
  }

  async updateOrganization(
    id: string,
    data: Partial<Organization>,
  ): Promise<Organization> {
    await this.organizationRepository.update(id, data);
    return this.getOrganizationById(id);
  }

  // Facility Methods
  async createFacility(data: Partial<Facility>): Promise<Facility> {
    const facility = this.facilityRepository.create(data);
    return this.facilityRepository.save(facility);
  }

  async getFacilityById(id: string): Promise<Facility> {
    return this.facilityRepository.findOne({
      where: { id },
      relations: ['organization', 'responsibility_matrices'],
    });
  }

  async getFacilitiesByOrganization(orgId: string): Promise<Facility[]> {
    return this.facilityRepository.find({
      where: { organization_id: orgId },
      relations: ['responsibility_matrices'],
    });
  }

  async updateFacility(id: string, data: Partial<Facility>): Promise<Facility> {
    await this.facilityRepository.update(id, data);
    return this.getFacilityById(id);
  }

  // Responsibility Matrix Methods
  async addResponsible(
    data: Partial<ResponsibilityMatrix>,
  ): Promise<ResponsibilityMatrix> {
    const matrix = this.responsibilityMatrixRepository.create(data);
    return this.responsibilityMatrixRepository.save(matrix);
  }

  async getResponsibilitiesByFacility(
    facilityId: string,
  ): Promise<ResponsibilityMatrix[]> {
    return this.responsibilityMatrixRepository.find({
      where: { facility_id: facilityId, status: 'ACTIVE' },
      relations: ['user', 'facility'],
    });
  }

  async getResponsibilitiesByUser(
    userId: string,
  ): Promise<ResponsibilityMatrix[]> {
    return this.responsibilityMatrixRepository.find({
      where: { user_id: userId, status: 'ACTIVE' },
      relations: ['facility'],
    });
  }

  async updateResponsibility(
    id: string,
    data: Partial<ResponsibilityMatrix>,
  ): Promise<ResponsibilityMatrix> {
    await this.responsibilityMatrixRepository.update(id, data);
    return this.responsibilityMatrixRepository.findOne({ where: { id } });
  }

  async deactivateResponsibility(id: string): Promise<void> {
    await this.responsibilityMatrixRepository.update(id, {
      status: 'INACTIVE',
    });
  }
}
