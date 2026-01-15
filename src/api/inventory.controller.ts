import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { InventoryService } from 'src/core/services/inventory.service';
import { InventoryItem, InventoryType } from 'src/core/entity/inventory.entity';

@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Inventory Item Endpoints
  @Post('items')
  async createInventoryItem(@Body() data: Partial<InventoryItem>) {
    return this.inventoryService.createInventoryItem(data);
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
    @Body() data: Partial<InventoryItem>,
  ) {
    return this.inventoryService.updateInventoryItem(id, data);
  }

  @Post('items/seed')
  async seedInventory() {
    await this.inventoryService.seedInventory();
    return { message: 'Inventory items seeded' };
  }

  // Issuance Log Endpoints
  @Post('issue')
  async issueInventory(
    @Body()
    body: {
      inventoryItemId: string;
      userId: string;
      quantity: number;
      issuedBy: string;
      notes?: string;
    },
  ) {
    return this.inventoryService.issueInventory(
      body.inventoryItemId,
      body.userId,
      body.quantity,
      body.issuedBy,
      body.notes,
    );
  }

  @Post('return')
  async returnInventory(
    @Body()
    body: {
      inventoryItemId: string;
      userId: string;
      quantity: number;
      notes?: string;
    },
  ) {
    return this.inventoryService.returnInventory(
      body.inventoryItemId,
      body.userId,
      body.quantity,
      body.notes,
    );
  }

  @Post('damaged')
  async reportDamaged(
    @Body()
    body: {
      inventoryItemId: string;
      userId: string;
      quantity: number;
      notes?: string;
    },
  ) {
    return this.inventoryService.reportDamaged(
      body.inventoryItemId,
      body.userId,
      body.quantity,
      body.notes,
    );
  }

  @Get('logs/item/:inventoryItemId')
  async getIssuanceLogsByItem(@Param('inventoryItemId') inventoryItemId: string) {
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
