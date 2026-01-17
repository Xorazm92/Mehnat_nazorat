import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity({ name: 'inspections' })
export class Inspection extends BaseEntity {
  @Column()
  title: string;

  @ManyToOne(() => Organization, (organization) => organization.inspections)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  organization_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inspector_id' })
  inspector: User;

  @Column()
  inspector_id: string;

  @Column({ type: 'date' })
  inspection_date: Date;

  @Column({
    type: 'simple-enum',
    enum: ['routine', 'safety_day', 'incident', 'winter_prep', 'summer_prep'],
  })
  inspection_type: string;

  @Column({
    type: 'simple-enum',
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  findings: string;

  @Column({ type: 'jsonb', nullable: true })
  violations: any[];

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'simple-array', nullable: true })
  photos: string[];

  @Column({ type: 'simple-array', nullable: true })
  documents: string[];

  @Column({ type: 'int', nullable: true, default: 0 })
  score: number;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;
}
