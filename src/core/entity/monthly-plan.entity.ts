import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { AnnualPlan } from './annual-plan.entity';
import { Facility } from './facility.entity';
import { PlanItem } from './plan-item.entity';

export enum MonthlyPlanStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity({ name: 'monthly_plans' })
export class MonthlyPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  annual_plan_id: string;

  @Column()
  facility_id: string;

  @Column()
  month: number; // 1-12

  @Column()
  year: number;

  @Column({
    type: 'simple-enum',
    enum: MonthlyPlanStatus,
    default: MonthlyPlanStatus.DRAFT,
  })
  status: MonthlyPlanStatus;

  @Column({ nullable: true })
  approved_by: string; // telegram_id

  @Column({ type: 'datetime', nullable: true })
  approved_at: Date;

  @Column({ type: 'datetime', nullable: true })
  due_date: Date; // Last day of month or custom

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => AnnualPlan, (plan) => plan.monthly_plans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'annual_plan_id' })
  annual_plan: AnnualPlan;

  @ManyToOne(() => Facility, (facility) => facility.monthly_plans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'facility_id' })
  facility: Facility;

  @OneToMany(() => PlanItem, (item) => item.monthly_plan, { cascade: true })
  items: PlanItem[];
}
