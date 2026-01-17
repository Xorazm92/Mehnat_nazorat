import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entity/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async create(data: Partial<Organization>): Promise<Organization> {
    const org = this.orgRepo.create(data);
    return this.orgRepo.save(org);
  }

  async findAll(): Promise<Organization[]> {
    return this.orgRepo.find({
      where: { is_active: true },
      relations: ['assigned_inspector', 'responsible_person'],
      order: { short_name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Organization | null> {
    return this.orgRepo.findOne({
      where: { id },
      relations: ['assigned_inspector', 'responsible_person'],
    });
  }

  async findByCode(code: string): Promise<Organization | null> {
    return this.orgRepo.findOne({
      where: { code },
      relations: ['assigned_inspector', 'responsible_person'],
    });
  }

  async findByInspector(inspectorId: string): Promise<Organization[]> {
    return this.orgRepo.find({
      where: { assigned_inspector_id: inspectorId },
      order: { short_name: 'ASC' },
    });
  }

  async assignInspector(
    orgId: string,
    inspectorId: string,
  ): Promise<Organization | null> {
    await this.orgRepo.update(orgId, {
      assigned_inspector_id: inspectorId,
    });
    return this.orgRepo.findOne({ where: { id: orgId } });
  }

  async getStats(): Promise<{
    total: number;
    by_type: Record<string, number>;
    by_inspector: Record<string, number>;
  }> {
    const orgs = await this.findAll();

    return {
      total: orgs.length,
      by_type: orgs.reduce((acc, org) => {
        acc[org.type] = (acc[org.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      by_inspector: orgs.reduce((acc, org) => {
        if (org.assigned_inspector_id) {
          acc[org.assigned_inspector_id] =
            (acc[org.assigned_inspector_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
