import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { TaskPriority, TaskStatus } from 'src/common/enum';

@Entity({ name: 'tasks' })
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  assigned_by: string; // telegram_id rahbar

  @Column()
  assigned_to: string; // telegram_id xodim

  @Column({ nullable: true })
  department: string;

  @Column({
    type: 'simple-enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'simple-enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({ type: 'datetime' })
  deadline: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @Column({ type: 'simple-array', nullable: true })
  files: string[]; // Vazifa fayllari

  @Column({ type: 'simple-array', nullable: true })
  images: string[]; // Vazifa rasmlari

  @Column({ type: 'simple-array', nullable: true })
  videos: string[]; // Vazifa videolari

  @Column({ type: 'simple-array', nullable: true })
  audios: string[]; // Vazifa audio fayllari

  @Column({ type: 'text', nullable: true })
  notes: string; // Qo'shimcha eslatmalar

  @Column({ default: false })
  is_urgent: boolean; // Shoshilinch vazifa

  @Column({ default: false })
  requires_photo_proof: boolean; // Rasm talab qilinadi

  @Column({ default: false })
  requires_video_proof: boolean; // Video talab qilinadi
}
