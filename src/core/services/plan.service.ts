import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { AnnualPlan } from '../entity/annual-plan.entity';
import { MonthlyPlan, MonthlyPlanStatus } from '../entity/monthly-plan.entity';
import { PlanItem, PlanItemStatus } from '../entity/plan-item.entity';
import { ApprovalStatus } from '../entity/annual-plan.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(AnnualPlan)
    private annualPlanRepository: Repository<AnnualPlan>,
    @InjectRepository(MonthlyPlan)
    private monthlyPlanRepository: Repository<MonthlyPlan>,
    @InjectRepository(PlanItem)
    private planItemRepository: Repository<PlanItem>,
  ) {}

  // Annual Plan Methods
  async createAnnualPlan(data: Partial<AnnualPlan>): Promise<AnnualPlan> {
    const plan = this.annualPlanRepository.create(data);
    return this.annualPlanRepository.save(plan);
  }

  async getAnnualPlanById(id: string): Promise<AnnualPlan> {
    return this.annualPlanRepository.findOne({
      where: { id },
      relations: ['organization', 'monthly_plans'],
    });
  }

  async getAnnualPlansByOrganization(orgId: string): Promise<AnnualPlan[]> {
    return this.annualPlanRepository.find({
      where: { organization_id: orgId },
      relations: ['monthly_plans'],
      order: { created_at: 'DESC' },
    });
  }

  async approveAnnualPlan(id: string, approvedBy: string): Promise<AnnualPlan> {
    await this.annualPlanRepository.update(id, {
      approval_status: ApprovalStatus.APPROVED,
      approved_by: approvedBy,
      approved_at: new Date(),
    });
    return this.getAnnualPlanById(id);
  }

  async rejectAnnualPlan(id: string): Promise<AnnualPlan> {
    await this.annualPlanRepository.update(id, {
      approval_status: ApprovalStatus.REJECTED,
    });
    return this.getAnnualPlanById(id);
  }

  // Monthly Plan Methods
  async createMonthlyPlan(data: Partial<MonthlyPlan>): Promise<MonthlyPlan> {
    const plan = this.monthlyPlanRepository.create(data);
    return this.monthlyPlanRepository.save(plan);
  }

  async getMonthlyPlanById(id: string): Promise<MonthlyPlan> {
    return this.monthlyPlanRepository.findOne({
      where: { id },
      relations: ['facility', 'annual_plan', 'items'],
    });
  }

  async getMonthlyPlansByFacility(facilityId: string): Promise<MonthlyPlan[]> {
    return this.monthlyPlanRepository.find({
      where: { facility_id: facilityId },
      relations: ['items'],
      order: { created_at: 'DESC' },
    });
  }

  async getMonthlyPlansByMonth(
    facilityId: string,
    month: number,
    year: number,
  ): Promise<MonthlyPlan> {
    return this.monthlyPlanRepository.findOne({
      where: { facility_id: facilityId, month, year },
      relations: ['items', 'annual_plan'],
    });
  }

  async approveMonthlyPlan(id: string, approvedBy: string): Promise<MonthlyPlan> {
    await this.monthlyPlanRepository.update(id, {
      status: MonthlyPlanStatus.APPROVED,
      approved_by: approvedBy,
      approved_at: new Date(),
    });
    return this.getMonthlyPlanById(id);
  }

  async rejectMonthlyPlan(id: string): Promise<MonthlyPlan> {
    await this.monthlyPlanRepository.update(id, {
      status: MonthlyPlanStatus.REJECTED,
    });
    return this.getMonthlyPlanById(id);
  }

  async markMonthlyPlanCompleted(id: string): Promise<MonthlyPlan> {
    await this.monthlyPlanRepository.update(id, {
      status: MonthlyPlanStatus.COMPLETED,
    });
    return this.getMonthlyPlanById(id);
  }

  // Plan Item Methods
  async createPlanItem(data: Partial<PlanItem>): Promise<PlanItem> {
    const item = this.planItemRepository.create(data);
    return this.planItemRepository.save(item);
  }

  async getPlanItemById(id: string): Promise<PlanItem> {
    return this.planItemRepository.findOne({
      where: { id },
      relations: ['monthly_plan', 'tasks'],
    });
  }

  async getPlanItemsByMonthlyPlan(monthlyPlanId: string): Promise<PlanItem[]> {
    return this.planItemRepository.find({
      where: { monthly_plan_id: monthlyPlanId },
      relations: ['tasks'],
    });
  }

  async updatePlanItem(id: string, data: Partial<PlanItem>): Promise<PlanItem> {
    await this.planItemRepository.update(id, data);
    return this.getPlanItemById(id);
  }

  async completePlanItem(
    id: string,
    completedBy: string,
    completionPercentage: number,
  ): Promise<PlanItem> {
    await this.planItemRepository.update(id, {
      status: PlanItemStatus.COMPLETED,
      completion_percentage: completionPercentage,
      completed_by: completedBy,
      completed_at: new Date(),
    });
    return this.getPlanItemById(id);
  }

  async getOverdueItems(): Promise<PlanItem[]> {
    return this.planItemRepository.find({
      where: {
        due_date: LessThan(new Date()),
        status: PlanItemStatus.NOT_STARTED,
      },
      relations: ['monthly_plan', 'monthly_plan.facility'],
    });
  }

  async updatePlanItemStatus(
    id: string,
    status: PlanItemStatus,
  ): Promise<PlanItem> {
    await this.planItemRepository.update(id, { status });
    return this.getPlanItemById(id);
  }

  async getItemsNearingDeadline(daysBeforeDeadline: number = 3): Promise<PlanItem[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysBeforeDeadline);

    return this.planItemRepository.find({
      where: {
        due_date: LessThan(futureDate),
        status: PlanItemStatus.NOT_STARTED,
      },
      relations: ['monthly_plan', 'monthly_plan.facility'],
    });
  }

  // Automatic monthly plan generation from annual plan
  async generateMonthlyPlansFromAnnualPlan(annualPlanId: string): Promise<void> {
    const annualPlan = await this.getAnnualPlanById(annualPlanId);

    // Create monthly plans for each facility
    for (const facility of annualPlan.organization.facilities) {
      for (let month = 1; month <= 12; month++) {
        const existingPlan = await this.getMonthlyPlansByMonth(
          facility.id,
          month,
          annualPlan.year,
        );

        if (!existingPlan) {
          const daysInMonth = new Date(annualPlan.year, month, 0).getDate();
          const dueDate = new Date(annualPlan.year, month - 1, daysInMonth);

          await this.createMonthlyPlan({
            annual_plan_id: annualPlanId,
            facility_id: facility.id,
            month,
            year: annualPlan.year,
            due_date: dueDate,
            status: MonthlyPlanStatus.DRAFT,
          });
        }
      }
    }
  }
}
