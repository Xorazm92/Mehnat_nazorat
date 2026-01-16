import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Facility } from './facility.entity';
import { User } from './user.entity';

@Entity({ name: 'responsibility_matrices' })
export class ResponsibilityMatrix {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  facility_id: string;

  @Column()
  user_id: string;

  @Column()
  role: string; // MANAGER, INSPECTOR, COORDINATOR, etc.

  @Column()
  scope: string; // e.g., "Winter preparation", "Equipment safety", "Inventory", "Reports"

  @Column({ nullable: true })
  kpi: string; // Key Performance Indicators

  @Column({ type: 'date' })
  effective_from: Date;

  @Column({ type: 'date', nullable: true })
  effective_to: Date;

  @Column({
    type: 'simple-enum',
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Facility, (facility) => facility.responsibility_matrices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'facility_id' })
  facility: Facility;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
