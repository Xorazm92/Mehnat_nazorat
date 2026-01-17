import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'file_archive' })
export class FileArchive extends BaseEntity {
  @Column()
  file_id: string;

  @Column()
  file_name: string;

  @Column()
  file_type: string;

  @Column({ type: 'bigint' })
  file_size: number;

  @Column({ nullable: true })
  mime_type: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_id' })
  uploaded_by: User;

  @Column()
  uploaded_by_id: string;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ nullable: true })
  organization_id: string;

  @Column({
    type: 'simple-enum',
    enum: ['report', 'inspection', 'document', 'photo', 'other'],
  })
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  uploaded_at: Date;

  @Column({ type: 'tsvector', nullable: true })
  search_vector: string;
}
