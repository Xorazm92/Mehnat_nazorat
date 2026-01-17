import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheConfigModule } from 'src/api/cache.module';
import { User } from 'src/core/entity/user.entity';
import {
  AskDepartmentScene,
  AskLastName,
  RegisterScene,
} from './update/scenes/register.scene';
import { Department } from 'src/core/entity/departments.entity';
import { ButtonsModule } from '../buttons/buttons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Department]),
    CacheConfigModule,
    ButtonsModule,
  ],
  providers: [RegisterScene, AskLastName, AskDepartmentScene],
})
export class UserModule {}
