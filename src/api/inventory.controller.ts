import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { InventoryService } from 'src/core/services/inventory.service';
import { InventoryType } from 'src/core/entity/inventory.entity';
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  IssueInventoryDto,
  ReturnInventoryDto,
  DamagedInventoryDto,
} from './dto/inventory.dto';

@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Inventory Item Endpoints
  @Post('items')
  async createInventoryItem(@Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.createInventoryItem(dto);
  }

  @Get('items/:id')
  async getInventoryItemById(@Param('id') id: string) {
    return this.inventoryService.getInventoryItemById(id);
  }

  @Get('items/type/:type')
  async getInventoryByType(@Param('type') type: InventoryType) {
    return this.inventoryService.getInventoryByType(type);
  }

  @Get('items/code/:code')
  async getInventoryByCode(@Param('code') code: string) {
    return this.inventoryService.getInventoryByCode(code);
  }

  @Get('items')
  async getAllInventory() {
    return this.inventoryService.getAllInventory();
  }

  @Put('items/:id')
  async updateInventoryItem(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.updateInventoryItem(id, dto);
  }

  @Post('items/seed')
  async seedInventory() {
    await this.inventoryService.seedInventory();
    return { message: 'Inventory items seeded' };
  }

  // Issuance Log Endpoints
  @Post('issue')
  async issueInventory(@Body() dto: IssueInventoryDto) {
    return this.inventoryService.issueInventory(
      dto.inventoryItemId,
      dto.userId,
      dto.quantity,
      dto.issuedBy,
      dto.notes,
    );
  }

  @Post('return')
  async returnInventory(@Body() dto: ReturnInventoryDto) {
    return this.inventoryService.returnInventory(
      dto.inventoryItemId,
      dto.userId,
      dto.quantity,
      dto.notes,
    );
  }

  @Post('damaged')
  async reportDamaged(@Body() dto: DamagedInventoryDto) {
    return this.inventoryService.reportDamaged(
      dto.inventoryItemId,
      dto.userId,
      dto.quantity,
      dto.notes,
    );
  }

  @Get('logs/item/:inventoryItemId')
  async getIssuanceLogsByItem(
    @Param('inventoryItemId') inventoryItemId: string,
  ) {
    return this.inventoryService.getIssuanceLogsByItem(inventoryItemId);
  }

  @Get('logs/user/:userId')
  async getIssuanceLogsByUser(@Param('userId') userId: string) {
    return this.inventoryService.getIssuanceLogsByUser(userId);
  }

  @Get('status')
  async getInventoryStatus() {
    return this.inventoryService.getInventoryStatus();
  }
}
