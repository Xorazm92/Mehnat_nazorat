import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from '../entity/inventory.entity';
import { IssuanceLog } from '../entity/issuance-log.entity';
import { InventoryService } from '../services/inventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, IssuanceLog])],
  providers: [InventoryService],
  exports: [InventoryService, TypeOrmModule],
})
export class InventoryModule {}
