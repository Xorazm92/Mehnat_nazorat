import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { MonthlyPlan } from './monthly-plan.entity';

export enum PlanType {
  GENERAL = 'GENERAL',
  SAFETY_INSPECTION = 'SAFETY_INSPECTION',
  WINTER_PREPARATION = 'WINTER_PREPARATION',
  EQUIPMENT_MAINTENANCE = 'EQUIPMENT_MAINTENANCE',
  SPECIAL = 'SPECIAL',
}

export enum ApprovalStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'annual_plans' })
export class AnnualPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organization_id: string;

  @Column()
  year: number;

  @Column({ type: 'simple-enum', enum: PlanType })
  type: PlanType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.DRAFT,
  })
  approval_status: ApprovalStatus;

  @Column({ nullable: true })
  approved_by: string; // telegram_id

  @Column({ type: 'datetime', nullable: true })
  approved_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Organization, (org) => org.annual_plans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => MonthlyPlan, (plan) => plan.annual_plan, { cascade: true })
  monthly_plans: MonthlyPlan[];
}
