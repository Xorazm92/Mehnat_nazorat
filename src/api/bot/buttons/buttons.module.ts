import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/core/entity/departments.entity';
import { User } from 'src/core/entity/user.entity';
import { ButtonsService } from './buttons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, User])],
  providers: [ButtonsService],
  exports: [ButtonsService],
})
export class ButtonsModule {}
