import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InventoryItem } from './inventory.entity';
import { User } from './user.entity';

export enum IssuanceType {
  ISSUED = 'ISSUED',
  RETURNED = 'RETURNED',
  DAMAGED = 'DAMAGED',
  REPLACED = 'REPLACED',
}

@Entity({ name: 'issuance_logs' })
export class IssuanceLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inventory_item_id: string;

  @Column()
  user_id: string; // Employee receiving/returning

  @Column({ type: 'simple-enum', enum: IssuanceType })
  type: IssuanceType;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  issued_by: string; // telegram_id of issuer

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  logged_at: Date;

  @ManyToOne(() => InventoryItem, (item) => item.issuance_logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inventory_item_id' })
  inventory_item: InventoryItem;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
