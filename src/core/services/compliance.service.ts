import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceItem } from '../entity/compliance-item.entity';
import { ComplianceCheck, ComplianceStatus } from '../entity/compliance-check.entity';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectRepository(ComplianceItem)
    private complianceItemRepository: Repository<ComplianceItem>,
    @InjectRepository(ComplianceCheck)
    private complianceCheckRepository: Repository<ComplianceCheck>,
  ) {}

  // Compliance Item Methods
  async createComplianceItem(
    data: Partial<ComplianceItem>,
  ): Promise<ComplianceItem> {
    const item = this.complianceItemRepository.create(data);
    return this.complianceItemRepository.save(item);
  }

  async getComplianceItemById(id: string): Promise<ComplianceItem> {
    return this.complianceItemRepository.findOne({
      where: { id },
      relations: ['compliance_checks'],
    });
  }

  async getComplianceItemsByCategory(category: string): Promise<ComplianceItem[]> {
    return this.complianceItemRepository.find({
      where: { category },
      relations: ['compliance_checks'],
    });
  }

  async getAllComplianceItems(): Promise<ComplianceItem[]> {
    return this.complianceItemRepository.find({
      relations: ['compliance_checks'],
    });
  }

  // Compliance Check Methods
  async createComplianceCheck(
    data: Partial<ComplianceCheck>,
  ): Promise<ComplianceCheck> {
    const check = this.complianceCheckRepository.create(data);
    return this.complianceCheckRepository.save(check);
  }

  async getComplianceCheckById(id: string): Promise<ComplianceCheck> {
    return this.complianceCheckRepository.findOne({
      where: { id },
      relations: ['task', 'compliance_item'],
    });
  }

  async getComplianceChecksByTask(taskId: string): Promise<ComplianceCheck[]> {
    return this.complianceCheckRepository.find({
      where: { task_id: taskId },
      relations: ['compliance_item'],
    });
  }

  async getComplianceChecksByComplianceItem(
    complianceItemId: string,
  ): Promise<ComplianceCheck[]> {
    return this.complianceCheckRepository.find({
      where: { compliance_item_id: complianceItemId },
      relations: ['task'],
    });
  }

  async updateComplianceCheck(
    id: string,
    data: Partial<ComplianceCheck>,
  ): Promise<ComplianceCheck> {
    await this.complianceCheckRepository.update(id, data);
    return this.getComplianceCheckById(id);
  }

  async markCompliant(
    id: string,
    checkedBy: string,
    evidenceFileId?: string,
  ): Promise<ComplianceCheck> {
    return this.updateComplianceCheck(id, {
      status: ComplianceStatus.COMPLIANT,
      checked_by: checkedBy,
      checked_at: new Date(),
      evidence_file_id: evidenceFileId,
    });
  }

  async markNonCompliant(
    id: string,
    checkedBy: string,
    comment: string,
  ): Promise<ComplianceCheck> {
    return this.updateComplianceCheck(id, {
      status: ComplianceStatus.NON_COMPLIANT,
      checked_by: checkedBy,
      checked_at: new Date(),
      comment,
    });
  }

  async getComplianceScore(taskId: string): Promise<number> {
    const checks = await this.getComplianceChecksByTask(taskId);
    if (checks.length === 0) return 0;

    const compliantCount = checks.filter(
      c => c.status === ComplianceStatus.COMPLIANT,
    ).length;
    return Math.round((compliantCount / checks.length) * 100);
  }

  async getComplianceSummary(organizationId?: string): Promise<{
    total_items: number;
    compliant: number;
    non_compliant: number;
    partial: number;
    not_checked: number;
    compliance_rate: number;
  }> {
    const items = organizationId
      ? await this.complianceItemRepository.find({
          relations: ['compliance_checks'],
        })
      : await this.getAllComplianceItems();

    const allChecks = items.flatMap(i => i.compliance_checks);

    const compliant = allChecks.filter(
      c => c.status === ComplianceStatus.COMPLIANT,
    ).length;
    const nonCompliant = allChecks.filter(
      c => c.status === ComplianceStatus.NON_COMPLIANT,
    ).length;
    const partial = allChecks.filter(
      c => c.status === ComplianceStatus.PARTIAL_COMPLIANCE,
    ).length;
    const notChecked = allChecks.filter(
      c => c.status === ComplianceStatus.NOT_CHECKED,
    ).length;

    return {
      total_items: items.length,
      compliant,
      non_compliant: nonCompliant,
      partial,
      not_checked: notChecked,
      compliance_rate:
        allChecks.length > 0
          ? Math.round((compliant / allChecks.length) * 100)
          : 0,
    };
  }

  // Seed compliance items for Qo'qon MTU
  async seedComplianceItems(): Promise<void> {
    const items = [
      {
        article_number: 'Art. 1',
        requirement:
          'Hayot va sog\'lig\'ini muhofaza qilish choralari harfiy bajarilishi',
        category: 'SAFETY',
        severity: 'MANDATORY' as const,
      },
      {
        article_number: 'Art. 2',
        requirement: 'Mehnat muhofazasi normativlarining bajarilishi',
        category: 'SAFETY',
        severity: 'MANDATORY' as const,
      },
      {
        article_number: 'Art. 3',
        requirement: 'Profilaktika chora-tadbirlarini o\'z vaqtida bajarish',
        category: 'MAINTENANCE',
        severity: 'MANDATORY' as const,
      },
      {
        article_number: 'Art. 4',
        requirement: 'Xavfsiz ish sharoitlarini ta\'minlash',
        category: 'SAFETY',
        severity: 'MANDATORY' as const,
      },
      {
        article_number: 'Art. 5',
        requirement: 'Oqibatsiz hodisalarni oldini olish chora-tadbirlar',
        category: 'SAFETY',
        severity: 'MANDATORY' as const,
      },
      {
        article_number: 'Art. 6',
        requirement: 'Kuz-qish mavsumiga tayyorgarlik',
        category: 'MAINTENANCE',
        severity: 'MANDATORY' as const,
      },
      {
        article_number: 'Art. 7',
        requirement: 'Talon tizimi va maxsus kiyim boshqaruvi',
        category: 'INVENTORY',
        severity: 'MANDATORY' as const,
      },
      {
        article_number: 'Art. 8',
        requirement: 'Oylik hisobotlar va tahlilni o\'z vaqtida topshirish',
        category: 'REPORTING',
        severity: 'MANDATORY' as const,
      },
    ];

    for (const item of items) {
      const existing = await this.complianceItemRepository.findOne({
        where: { article_number: item.article_number },
      });

      if (!existing) {
        await this.createComplianceItem(item);
      }
    }
  }
}
