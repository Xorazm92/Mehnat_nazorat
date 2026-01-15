import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CampaignAction } from './campaign-action.entity';

export enum CampaignType {
  WINTER_PREPARATION = 'WINTER_PREPARATION',
  SAFETY_DAY = 'SAFETY_DAY',
  EQUIPMENT_INSPECTION = 'EQUIPMENT_INSPECTION',
  PREVENTIVE_MEASURES = 'PREVENTIVE_MEASURES',
  TRAINING = 'TRAINING',
  AUDIT = 'AUDIT',
}

@Entity({ name: 'campaigns' })
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-enum', enum: CampaignType })
  type: CampaignType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'text', nullable: true })
  objectives: string;

  @Column({ nullable: true })
  responsible_officer: string; // telegram_id

  @Column({ type: 'simple-enum', enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'DRAFT' })
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => CampaignAction, action => action.campaign, { cascade: true })
  actions: CampaignAction[];
}
