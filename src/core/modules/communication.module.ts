import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entity/message.entity';
import { Appeals } from '../entity/appeal.entity';
import { Campaign } from '../entity/campaign.entity';
import { CampaignAction } from '../entity/campaign-action.entity';
import { MessageService } from '../services/message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Appeals, Campaign, CampaignAction]),
  ],
  providers: [MessageService],
  exports: [MessageService, TypeOrmModule],
})
export class CommunicationModule {}
