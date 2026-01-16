import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MonthlyPlan } from './monthly-plan.entity';
import { Task } from './task.entity';

export enum PlanItemStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

@Entity({ name: 'plan_items' })
export class PlanItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  monthly_plan_id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  normative_reference: string; // e.g., "Article 3", "Section 5.2"

  @Column({ nullable: true })
  assigned_to: string; // telegram_id

  @Column({ type: 'date' })
  due_date: Date;

  @Column({
    type: 'simple-enum',
    enum: PlanItemStatus,
    default: PlanItemStatus.NOT_STARTED,
  })
  status: PlanItemStatus;

  @Column({ type: 'integer', default: 0 })
  completion_percentage: number; // 0-100

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  completed_by: string; // telegram_id

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => MonthlyPlan, (plan) => plan.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'monthly_plan_id' })
  monthly_plan: MonthlyPlan;

  @OneToMany(() => Task, (task) => task.plan_item, { cascade: true })
  tasks: Task[];
}
