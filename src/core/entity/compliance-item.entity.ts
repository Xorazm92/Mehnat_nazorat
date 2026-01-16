import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ComplianceCheck } from './compliance-check.entity';

@Entity({ name: 'compliance_items' })
export class ComplianceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  article_number: string; // e.g., "Art. 1", "Section 5"

  @Column({ type: 'text' })
  requirement: string; // Full text of regulation

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  category: string; // e.g., "SAFETY", "MAINTENANCE", "INVENTORY", "REPORTING"

  @Column({
    type: 'simple-enum',
    enum: ['MANDATORY', 'RECOMMENDED'],
    default: 'MANDATORY',
  })
  severity: 'MANDATORY' | 'RECOMMENDED';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => ComplianceCheck, (check) => check.compliance_item, {
    cascade: true,
  })
  compliance_checks: ComplianceCheck[];
}
