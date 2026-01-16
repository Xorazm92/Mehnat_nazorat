import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Facility } from './facility.entity';
import { AnnualPlan } from './annual-plan.entity';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

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

  @OneToMany(() => Facility, (facility) => facility.organization, {
    cascade: true,
  })
  facilities: Facility[];

  @OneToMany(() => AnnualPlan, (plan) => plan.organization, { cascade: true })
  annual_plans: AnnualPlan[];
}
