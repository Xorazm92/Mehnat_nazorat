import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IssuanceLog } from './issuance-log.entity';

export enum InventoryType {
  SAFETY_EQUIPMENT = 'SAFETY_EQUIPMENT',
  PROTECTIVE_CLOTHING = 'PROTECTIVE_CLOTHING',
  TOOLS = 'TOOLS',
  DOCUMENTS = 'DOCUMENTS',
  OTHER = 'OTHER',
}

@Entity({ name: 'inventory_items' })
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: 'simple-enum', enum: InventoryType })
  type: InventoryType;

  @Column()
  description: string;

  @Column()
  unit: string; // pcs, pairs, sets, etc.

  @Column({ type: 'integer' })
  total_quantity: number;

  @Column({ type: 'integer', default: 0 })
  issued_quantity: number;

  @Column({ type: 'integer', default: 0 })
  returned_quantity: number;

  @Column({ type: 'integer', default: 0 })
  damaged_quantity: number;

  @Column({ type: 'date', nullable: true })
  expiry_date: Date;

  @Column({ type: 'simple-enum', enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' })
  status: 'ACTIVE' | 'ARCHIVED';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => IssuanceLog, log => log.inventory_item, { cascade: true })
  issuance_logs: IssuanceLog[];
}
