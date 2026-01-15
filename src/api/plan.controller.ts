import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PlanService } from 'src/core/services/plan.service';
import { AnnualPlan } from 'src/core/entity/annual-plan.entity';
import { MonthlyPlan } from 'src/core/entity/monthly-plan.entity';
import { PlanItem } from 'src/core/entity/plan-item.entity';

@Controller('api/plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // Annual Plan Endpoints
  @Post('annual')
  async createAnnualPlan(@Body() data: Partial<AnnualPlan>) {
    return this.planService.createAnnualPlan(data);
  }

  @Get('annual/:id')
  async getAnnualPlanById(@Param('id') id: string) {
    return this.planService.getAnnualPlanById(id);
  }

  @Get('annual/organization/:orgId')
  async getAnnualPlansByOrganization(@Param('orgId') orgId: string) {
    return this.planService.getAnnualPlansByOrganization(orgId);
  }

  @Put('annual/:id/approve')
  async approveAnnualPlan(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.planService.approveAnnualPlan(id, approvedBy);
  }

  @Put('annual/:id/reject')
  async rejectAnnualPlan(@Param('id') id: string) {
    return this.planService.rejectAnnualPlan(id);
  }

  // Monthly Plan Endpoints
  @Post('monthly')
  async createMonthlyPlan(@Body() data: Partial<MonthlyPlan>) {
    return this.planService.createMonthlyPlan(data);
  }

  @Get('monthly/:id')
  async getMonthlyPlanById(@Param('id') id: string) {
    return this.planService.getMonthlyPlanById(id);
  }

  @Get('monthly/facility/:facilityId')
  async getMonthlyPlansByFacility(@Param('facilityId') facilityId: string) {
    return this.planService.getMonthlyPlansByFacility(facilityId);
  }

  @Get('monthly/facility/:facilityId/month/:month/year/:year')
  async getMonthlyPlansByMonth(
    @Param('facilityId') facilityId: string,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.planService.getMonthlyPlansByMonth(
      facilityId,
      Number(month),
      Number(year),
    );
  }

  @Put('monthly/:id/approve')
  async approveMonthlyPlan(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.planService.approveMonthlyPlan(id, approvedBy);
  }

  @Put('monthly/:id/reject')
  async rejectMonthlyPlan(@Param('id') id: string) {
    return this.planService.rejectMonthlyPlan(id);
  }

  @Put('monthly/:id/complete')
  async markMonthlyPlanCompleted(@Param('id') id: string) {
    return this.planService.markMonthlyPlanCompleted(id);
  }

  // Plan Item Endpoints
  @Post('items')
  async createPlanItem(@Body() data: Partial<PlanItem>) {
    return this.planService.createPlanItem(data);
  }

  @Get('items/:id')
  async getPlanItemById(@Param('id') id: string) {
    return this.planService.getPlanItemById(id);
  }

  @Get('items/plan/:monthlyPlanId')
  async getPlanItemsByMonthlyPlan(
    @Param('monthlyPlanId') monthlyPlanId: string,
  ) {
    return this.planService.getPlanItemsByMonthlyPlan(monthlyPlanId);
  }

  @Put('items/:id')
  async updatePlanItem(
    @Param('id') id: string,
    @Body() data: Partial<PlanItem>,
  ) {
    return this.planService.updatePlanItem(id, data);
  }

  @Put('items/:id/complete')
  async completePlanItem(
    @Param('id') id: string,
    @Body() body: { completedBy: string; completionPercentage: number },
  ) {
    return this.planService.completePlanItem(
      id,
      body.completedBy,
      body.completionPercentage,
    );
  }

  @Get('items/overdue')
  async getOverdueItems() {
    return this.planService.getOverdueItems();
  }

  @Get('items/nearing-deadline')
  async getItemsNearingDeadline(
    @Query('days') days: string = '3',
  ) {
    return this.planService.getItemsNearingDeadline(Number(days));
  }

  @Post('annual/:id/generate-monthly')
  async generateMonthlyPlans(@Param('id') annualPlanId: string) {
    await this.planService.generateMonthlyPlansFromAnnualPlan(annualPlanId);
    return { message: 'Monthly plans generated successfully' };
  }
}
