import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';
import { ComplianceItem } from './compliance-item.entity';

export enum ComplianceStatus {
  NOT_CHECKED = 'NOT_CHECKED',
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PARTIAL_COMPLIANCE = 'PARTIAL_COMPLIANCE',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

@Entity({ name: 'compliance_checks' })
export class ComplianceCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  task_id: string;

  @Column()
  compliance_item_id: string;

  @Column({ type: 'simple-enum', enum: ComplianceStatus, default: ComplianceStatus.NOT_CHECKED })
  status: ComplianceStatus;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ nullable: true })
  evidence_file_id: string; // Reference to file storage

  @Column({ nullable: true })
  checked_by: string; // telegram_id

  @Column({ type: 'datetime', nullable: true })
  checked_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Task, task => task.compliance_checks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => ComplianceItem, item => item.compliance_checks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'compliance_item_id' })
  compliance_item: ComplianceItem;
}
