import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Campaign } from './campaign.entity';
import { Task } from './task.entity';

@Entity({ name: 'campaign_actions' })
export class CampaignAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaign_id: string;

  @Column({ nullable: true })
  task_id: string;

  @Column()
  action_title: string;

  @Column({ type: 'text', nullable: true })
  action_description: string;

  @Column({ type: 'date' })
  scheduled_date: Date;

  @Column({ nullable: true })
  assigned_to: string; // telegram_id

  @Column({ type: 'simple-enum', enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'NOT_STARTED' })
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Campaign, campaign => campaign.actions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @ManyToOne(() => Task, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'task_id' })
  task: Task;
}
