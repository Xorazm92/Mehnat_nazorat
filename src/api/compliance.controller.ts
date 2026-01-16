import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ComplianceService } from 'src/core/services/compliance.service';
import {
  CreateComplianceItemDto,
  CreateComplianceCheckDto,
  UpdateComplianceCheckDto,
  MarkComplianceDto,
} from './dto/compliance.dto';

@Controller('api/compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  // Compliance Item Endpoints
  @Post('items')
  async createComplianceItem(@Body() dto: CreateComplianceItemDto) {
    return this.complianceService.createComplianceItem(dto);
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
  async createComplianceCheck(@Body() dto: CreateComplianceCheckDto) {
    return this.complianceService.createComplianceCheck(dto);
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
    @Body() dto: UpdateComplianceCheckDto,
  ) {
    return this.complianceService.updateComplianceCheck(id, dto);
  }

  @Put('checks/:id/compliant')
  async markCompliant(@Param('id') id: string, @Body() dto: MarkComplianceDto) {
    return this.complianceService.markCompliant(
      id,
      dto.checkedBy,
      dto.evidenceFileId,
    );
  }

  @Put('checks/:id/non-compliant')
  async markNonCompliant(
    @Param('id') id: string,
    @Body() dto: MarkComplianceDto,
  ) {
    return this.complianceService.markNonCompliant(
      id,
      dto.checkedBy,
      dto.comment ?? '',
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
