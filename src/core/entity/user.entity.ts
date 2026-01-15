import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/database';
import { UserRole, UserStatus } from 'src/common/enum';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  telegram_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column()
  department: string;

  @Column({
    type: 'simple-enum',
    enum: UserStatus,
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;
}
