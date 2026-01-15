import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { ResponsibilityMatrix } from './responsibility-matrix.entity';
import { MonthlyPlan } from './monthly-plan.entity';

@Entity({ name: 'facilities' })
export class Facility {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  organization_id: string;

  @Column({ nullable: true })
  division: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'simple-enum', enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Organization, org => org.facilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => ResponsibilityMatrix, matrix => matrix.facility, { cascade: true })
  responsibility_matrices: ResponsibilityMatrix[];

  @OneToMany(() => MonthlyPlan, plan => plan.facility, { cascade: true })
  monthly_plans: MonthlyPlan[];
}
