import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { ReportStatus } from 'src/common/enum';

@Entity({ name: 'reports' })
export class Report extends BaseEntity {
  @Column()
  task_id: string;

  @Column()
  submitted_by: string; // telegram_id xodim

  @Column({ type: 'text' })
  report_text: string;

  @Column({ type: 'simple-array', nullable: true })
  files: string[]; // Hujjatlar (PDF, DOCX, XLSX, etc)

  @Column({ type: 'simple-array', nullable: true })
  images: string[]; // Rasmlar (JPG, PNG, etc)

  @Column({ type: 'simple-array', nullable: true })
  videos: string[]; // Videolar

  @Column({ type: 'simple-array', nullable: true })
  audios: string[]; // Audio xabarlar

  @Column({
    type: 'simple-enum',
    enum: ReportStatus,
  })
  status: ReportStatus;

  @Column({ type: 'timestamptz' })
  submitted_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  reviewed_at: Date;

  @Column({ type: 'text', nullable: true })
  reviewer_comment: string; // Rahbar izohi

  @Column({ type: 'int', default: 0 })
  completion_percentage: number; // 0-100

  @Column({ default: false })
  is_final: boolean; // Yakuniy hisobot

  @Column({ type: 'text', nullable: true })
  rejection_reason: string; // Rad etish sababi
}
