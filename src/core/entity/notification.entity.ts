import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { User } from './user.entity';

@Entity({ name: 'notifications' })
export class Notification extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'simple-enum',
    enum: ['info', 'warning', 'urgent', 'success'],
    default: 'info',
  })
  type: string;

  @Column({
    type: 'simple-enum',
    enum: ['report', 'deadline', 'inspection', 'system'],
  })
  category: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ type: 'datetime', nullable: true })
  read_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  action_data: any;

  @Column({ type: 'datetime' })
  sent_at: Date;
}
