import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Department } from '../entity/departments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Department])],
  exports: [TypeOrmModule],
})
export class UserModule {}
