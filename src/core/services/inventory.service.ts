import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem, InventoryType } from '../entity/inventory.entity';
import { IssuanceLog, IssuanceType } from '../entity/issuance-log.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(IssuanceLog)
    private issuanceLogRepository: Repository<IssuanceLog>,
  ) {}

  // Inventory Item Methods
  async createInventoryItem(
    data: Partial<InventoryItem>,
  ): Promise<InventoryItem> {
    const item = this.inventoryItemRepository.create(data);
    return this.inventoryItemRepository.save(item);
  }

  async getInventoryItemById(id: string): Promise<InventoryItem> {
    return this.inventoryItemRepository.findOne({
      where: { id },
      relations: ['issuance_logs'],
    });
  }

  async getInventoryByType(type: InventoryType): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.find({
      where: { type, status: 'ACTIVE' },
      relations: ['issuance_logs'],
    });
  }

  async getInventoryByCode(code: string): Promise<InventoryItem> {
    return this.inventoryItemRepository.findOne({
      where: { code },
      relations: ['issuance_logs'],
    });
  }

  async getAllInventory(): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.find({
      where: { status: 'ACTIVE' },
      relations: ['issuance_logs'],
    });
  }

  async updateInventoryItem(
    id: string,
    data: Partial<InventoryItem>,
  ): Promise<InventoryItem> {
    await this.inventoryItemRepository.update(id, data);
    return this.getInventoryItemById(id);
  }

  // Issuance Log Methods
  async issueInventory(
    inventoryItemId: string,
    userId: string,
    quantity: number,
    issuedBy: string,
    notes?: string,
  ): Promise<IssuanceLog> {
    // Create log entry
    const log = this.issuanceLogRepository.create({
      inventory_item_id: inventoryItemId,
      user_id: userId,
      type: IssuanceType.ISSUED,
      quantity,
      issued_by: issuedBy,
      notes,
    });

    // Update inventory count
    const item = await this.getInventoryItemById(inventoryItemId);
    await this.updateInventoryItem(inventoryItemId, {
      issued_quantity: item.issued_quantity + quantity,
    });

    return this.issuanceLogRepository.save(log);
  }

  async returnInventory(
    inventoryItemId: string,
    userId: string,
    quantity: number,
    notes?: string,
  ): Promise<IssuanceLog> {
    const log = this.issuanceLogRepository.create({
      inventory_item_id: inventoryItemId,
      user_id: userId,
      type: IssuanceType.RETURNED,
      quantity,
      notes,
    });

    // Update inventory count
    const item = await this.getInventoryItemById(inventoryItemId);
    await this.updateInventoryItem(inventoryItemId, {
      returned_quantity: item.returned_quantity + quantity,
    });

    return this.issuanceLogRepository.save(log);
  }

  async reportDamaged(
    inventoryItemId: string,
    userId: string,
    quantity: number,
    notes?: string,
  ): Promise<IssuanceLog> {
    const log = this.issuanceLogRepository.create({
      inventory_item_id: inventoryItemId,
      user_id: userId,
      type: IssuanceType.DAMAGED,
      quantity,
      notes,
    });

    // Update inventory count
    const item = await this.getInventoryItemById(inventoryItemId);
    await this.updateInventoryItem(inventoryItemId, {
      damaged_quantity: item.damaged_quantity + quantity,
    });

    return this.issuanceLogRepository.save(log);
  }

  async getIssuanceLogsByItem(inventoryItemId: string): Promise<IssuanceLog[]> {
    return this.issuanceLogRepository.find({
      where: { inventory_item_id: inventoryItemId },
      relations: ['user'],
      order: { logged_at: 'DESC' },
    });
  }

  async getIssuanceLogsByUser(userId: string): Promise<IssuanceLog[]> {
    return this.issuanceLogRepository.find({
      where: { user_id: userId },
      relations: ['inventory_item'],
      order: { logged_at: 'DESC' },
    });
  }

  async getInventoryStatus(): Promise<{
    total_items: number;
    in_stock: number;
    issued_out: number;
    damaged: number;
    expiring_soon: InventoryItem[];
  }> {
    const allItems = await this.getAllInventory();
    const expiringDate = new Date();
    expiringDate.setDate(expiringDate.getDate() + 30);

    const expiring_soon = allItems.filter(
      (item) =>
        item.expiry_date &&
        item.expiry_date <= expiringDate &&
        item.expiry_date > new Date(),
    );

    return {
      total_items: allItems.length,
      in_stock: allItems.reduce((sum, item) => {
        const available =
          item.total_quantity - item.issued_quantity - item.damaged_quantity;
        return sum + available;
      }, 0),
      issued_out: allItems.reduce((sum, item) => sum + item.issued_quantity, 0),
      damaged: allItems.reduce((sum, item) => sum + item.damaged_quantity, 0),
      expiring_soon,
    };
  }

  // Seed protective clothing and safety equipment
  async seedInventory(): Promise<void> {
    const items = [
      {
        name: "Xavfsizlik dubulg'asi (Helmet)",
        code: 'HELMET-001',
        type: InventoryType.PROTECTIVE_CLOTHING,
        description: "Temir yo'l xodimlarining sho'rmali dubulg'asi",
        unit: 'pcs',
        total_quantity: 100,
      },
      {
        name: "Qaytariluvchi ko'ylak",
        code: 'VEST-001',
        type: InventoryType.PROTECTIVE_CLOTHING,
        description: "Reflektiv qaytariluvchi ko'ylak",
        unit: 'pcs',
        total_quantity: 150,
      },
      {
        name: "Qo'l qo'riqlovchisi",
        code: 'GLOVES-001',
        type: InventoryType.PROTECTIVE_CLOTHING,
        description: "Chiqaloq qo'l qo'riqlovchisi",
        unit: 'pairs',
        total_quantity: 200,
      },
      {
        name: "Oyoq qo'riqlovchisi",
        code: 'BOOTS-001',
        type: InventoryType.PROTECTIVE_CLOTHING,
        description: "Xavfsizlik oyoq qo'riqlovchisi",
        unit: 'pairs',
        total_quantity: 100,
      },
      {
        name: 'Talon (Respirator)',
        code: 'RESPIRATOR-001',
        type: InventoryType.SAFETY_EQUIPMENT,
        description: "Til ko'rtilgan talon",
        unit: 'pcs',
        total_quantity: 300,
      },
      {
        name: "Ko'z qo'riqlovchisi",
        code: 'GOGGLES-001',
        type: InventoryType.PROTECTIVE_CLOTHING,
        description: "Kimyoviy ko'z qo'riqlovchisi",
        unit: 'pcs',
        total_quantity: 150,
      },
    ];

    for (const item of items) {
      const existing = await this.getInventoryByCode(item.code);
      if (!existing) {
        await this.createInventoryItem(item);
      }
    }
  }
}
