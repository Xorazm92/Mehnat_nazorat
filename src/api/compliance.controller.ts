import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ComplianceService } from 'src/core/services/compliance.service';
import { ComplianceItem } from 'src/core/entity/compliance-item.entity';
import { ComplianceCheck, ComplianceStatus } from 'src/core/entity/compliance-check.entity';

@Controller('api/compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  // Compliance Item Endpoints
  @Post('items')
  async createComplianceItem(@Body() data: Partial<ComplianceItem>) {
    return this.complianceService.createComplianceItem(data);
  }

  @Get('items/:id')
  async getComplianceItemById(@Param('id') id: string) {
    return this.complianceService.getComplianceItemById(id);
  }

  @Get('items/category/:category')
  async getComplianceItemsByCategory(@Param('category') category: string) {
    return this.complianceService.getComplianceItemsByCategory(category);
  }

  @Get('items')
  async getAllComplianceItems() {
    return this.complianceService.getAllComplianceItems();
  }

  @Post('items/seed')
  async seedComplianceItems() {
    await this.complianceService.seedComplianceItems();
    return { message: 'Compliance items seeded' };
  }

  // Compliance Check Endpoints
  @Post('checks')
  async createComplianceCheck(@Body() data: Partial<ComplianceCheck>) {
    return this.complianceService.createComplianceCheck(data);
  }

  @Get('checks/:id')
  async getComplianceCheckById(@Param('id') id: string) {
    return this.complianceService.getComplianceCheckById(id);
  }

  @Get('checks/task/:taskId')
  async getComplianceChecksByTask(@Param('taskId') taskId: string) {
    return this.complianceService.getComplianceChecksByTask(taskId);
  }

  @Get('checks/item/:complianceItemId')
  async getComplianceChecksByComplianceItem(
    @Param('complianceItemId') complianceItemId: string,
  ) {
    return this.complianceService.getComplianceChecksByComplianceItem(
      complianceItemId,
    );
  }

  @Put('checks/:id')
  async updateComplianceCheck(
    @Param('id') id: string,
    @Body() data: Partial<ComplianceCheck>,
  ) {
    return this.complianceService.updateComplianceCheck(id, data);
  }

  @Put('checks/:id/compliant')
  async markCompliant(
    @Param('id') id: string,
    @Body() body: { checkedBy: string; evidenceFileId?: string },
  ) {
    return this.complianceService.markCompliant(
      id,
      body.checkedBy,
      body.evidenceFileId,
    );
  }

  @Put('checks/:id/non-compliant')
  async markNonCompliant(
    @Param('id') id: string,
    @Body() body: { checkedBy: string; comment: string },
  ) {
    return this.complianceService.markNonCompliant(
      id,
      body.checkedBy,
      body.comment,
    );
  }

  @Get('score/task/:taskId')
  async getComplianceScore(@Param('taskId') taskId: string) {
    const score = await this.complianceService.getComplianceScore(taskId);
    return { score };
  }

  @Get('summary')
  async getComplianceSummary(@Query('organizationId') organizationId?: string) {
    return this.complianceService.getComplianceSummary(organizationId);
  }
}
