import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { PeriodType } from 'src/common/enum';

@Entity({ name: 'statistics' })
export class Statistics extends BaseEntity {
  @Column()
  user_id: string; // telegram_id

  @Column({ type: 'simple-enum', enum: PeriodType })
  period_type: PeriodType;

  @Column({ type: 'datetime' })
  period_start: Date;

  @Column({ type: 'datetime' })
  period_end: Date;

  @Column({ type: 'int', default: 0 })
  tasks_assigned: number; // Berilgan vazifalar

  @Column({ type: 'int', default: 0 })
  tasks_completed: number; // Bajarilgan

  @Column({ type: 'int', default: 0 })
  tasks_pending: number; // Kutilayotgan

  @Column({ type: 'int', default: 0 })
  tasks_rejected: number; // Rad etilgan

  @Column({ type: 'int', default: 0 })
  tasks_overdue: number; // Muddati o'tgan

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  average_completion_time: number; // O'rtacha bajarilish vaqti (soatlarda)

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  performance_score: number; // Samaradorlik balli (0-100)

  @Column({ type: 'datetime' })
  calculated_at: Date;
}
