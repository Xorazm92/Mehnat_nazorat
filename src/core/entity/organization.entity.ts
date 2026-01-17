import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { User } from './user.entity';
import { ReportSubmission } from './report-submission.entity';
import { Inspection } from './inspection.entity';
import { Deadline } from './deadline.entity';

@Entity({ name: 'organizations' })
export class Organization extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  full_name: string;

  @Column()
  short_name: string;

  @Column({
    type: 'simple-enum',
    enum: ['MTU', 'AJ', 'UK', 'MChJ', 'Boshqarma'],
  })
  type: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'responsible_person_id' })
  responsible_person: User;

  @Column({ nullable: true })
  responsible_person_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_inspector_id' })
  assigned_inspector: User;

  @Column({ nullable: true })
  assigned_inspector_id: string;

  @OneToMany(
    () => ReportSubmission,
    (reportSubmission) => reportSubmission.organization,
  )
  reports: ReportSubmission[];

  @OneToMany(() => Inspection, (inspection) => inspection.organization)
  inspections: Inspection[];

  @OneToMany(() => Deadline, (deadline) => deadline.organization)
  deadlines: Deadline[];

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;
}
