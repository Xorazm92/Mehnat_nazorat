import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { ReportHistory } from './report-history.entity';

@Entity({ name: 'report_submissions' })
export class ReportSubmission extends BaseEntity {
  @Column()
  title: string;

  @Column({
    type: 'simple-enum',
    enum: ['monthly', 'quarterly', 'annual', 'incident', 'safety_day'],
  })
  report_type: string;

  @ManyToOne(() => Organization, (organization) => organization.reports, {
    eager: false,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  organization_id: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'submitted_by_id' })
  submitted_by: User;

  @Column()
  submitted_by_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_inspector_id' })
  assigned_inspector: User;

  @Column({ nullable: true })
  assigned_inspector_id: string;

  @Column({
    type: 'simple-enum',
    enum: ['pending', 'under_review', 'approved', 'rejected', 'revision_needed'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'simple-array', nullable: true })
  files: string[];

  @Column({ type: 'jsonb', nullable: true })
  file_metadata: any[];

  @Column({ type: 'jsonb', nullable: true })
  parsed_data: any;

  @Column({ type: 'datetime', nullable: true })
  deadline: Date;

  @Column({ type: 'datetime', nullable: true })
  submitted_at: Date;

  @Column({ type: 'datetime', nullable: true })
  reviewed_at: Date;

  @Column({ type: 'datetime', nullable: true })
  approved_at: Date;

  @Column({ type: 'text', nullable: true })
  reviewer_comment: string;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by_id' })
  reviewed_by: User;

  @Column({ nullable: true })
  reviewed_by_id: string;

  @OneToMany(() => ReportHistory, (history) => history.report)
  history: ReportHistory[];

  @Column({ default: false })
  is_late: boolean;

  @Column({ type: 'int', default: 0 })
  revision_count: number;
}
