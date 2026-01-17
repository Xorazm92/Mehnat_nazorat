import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity({ name: 'deadlines' })
export class Deadline extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: ['report', 'inspection', 'safety_day', 'meeting', 'other'],
  })
  type: string;

  @ManyToOne(() => Organization, (organization) => organization.deadlines, {
    nullable: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ nullable: true })
  organization_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assigned_to: User;

  @Column({ nullable: true })
  assigned_to_id: string;

  @Column({ type: 'datetime' })
  due_date: Date;

  @Column({
    type: 'simple-enum',
    enum: ['pending', 'in_progress', 'completed', 'overdue', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'jsonb', default: () => "'[7,3,1]'" })
  reminder_days: number[];

  @Column({ type: 'jsonb', default: () => "'[]'" })
  reminders_sent: string[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column()
  created_by_id: string;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;
}
