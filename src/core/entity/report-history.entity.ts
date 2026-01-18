import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { ReportSubmission } from './report-submission.entity';
import { User } from './user.entity';

@Entity({ name: 'report_history' })
export class ReportHistory extends BaseEntity {
  @ManyToOne(() => ReportSubmission, (report) => report.history)
  @JoinColumn({ name: 'report_id' })
  report: ReportSubmission;

  @Column()
  report_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changed_by_id' })
  changed_by: User;

  @Column()
  changed_by_id: string;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'timestamptz' })
  changed_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;
}
