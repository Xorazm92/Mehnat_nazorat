import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/database';

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @Column()
  from_user: string; // telegram_id yuboruvchi

  @Column()
  to_user: string; // telegram_id qabul qiluvchi

  @Column({ type: 'text', nullable: true })
  text: string; // Matn xabar

  @Column({ nullable: true })
  message_type: string; // text, photo, video, audio, document, voice, sticker

  @Column({ type: 'simple-array', nullable: true })
  files: string[]; // Fayllar

  @Column({ nullable: true })
  task_id: string; // Vazifa bilan bog'liq bo'lsa

  @Column({ nullable: true })
  report_id: string; // Hisobot bilan bog'liq bo'lsa

  @Column({ default: false })
  is_read: boolean; // O'qilgan

  @Column({ type: 'datetime' })
  sent_at: Date;

  @Column({ type: 'datetime', nullable: true })
  read_at: Date;

  @Column({ type: 'text', nullable: true })
  reply_to: string; // Javob berilgan xabar ID
}
