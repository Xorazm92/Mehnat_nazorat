import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/database';

@Entity({ name: 'salaries' })
export class Salary extends BaseEntity {
  @Column()
  user_id: string; // telegram_id

  @Column()
  month: string; // YYYY-MM format

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  base_salary: number; // Asosiy maosh

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bonus: number; // Bonus

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  penalty: number; // Jarima

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number; // Jami

  @Column({ type: 'int', default: 0 })
  tasks_completed: number; // Bajarilgan vazifalar

  @Column({ type: 'int', default: 0 })
  tasks_total: number; // Jami vazifalar

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  completion_rate: number; // Bajarilish foizi

  @Column({ type: 'timestamptz' })
  calculated_at: Date;

  @Column({ type: 'text', nullable: true })
  notes: string; // Qo'shimcha eslatmalar
}
