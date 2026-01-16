import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TelegrafModule, InjectBot } from 'nestjs-telegraf';
import { session, Telegraf } from 'telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config';
import { BotUpdate } from './bot.update';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { TaskUpdate } from './tasks/task.update';
import { ReportUpdate } from './reports/report.update';
import { StatisticsUpdate } from './statistics/statistics.update';
import { SalaryUpdate } from './salary/salary.update';
import { MessageUpdate } from './messages/message.update';

import { CreateTaskScene } from './tasks/scenes/create-task.scene';
import { CreateReportScene } from './reports/scenes/create-report.scene';
import { SendMessageScene } from './messages/scenes/send-message.scene';
import { CalculateSalaryScene } from './salary/scenes/calculate-salary.scene';

import { CoreModule } from 'src/core/core.module';
import { ButtonsModule } from './buttons/buttons.module';
import { ContextType } from 'src/common/types';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    AdminModule,
    CoreModule,
    ButtonsModule,
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        token: configService.get('bot.token', { infer: true }) ?? '',
        middlewares: [session()],
        include: [BotModule, UserModule],
        launchOptions: {
          dropPendingUpdates: false,
        },
      }),
    }),
  ],
  providers: [
    BotUpdate,
    TaskUpdate,
    ReportUpdate,
    StatisticsUpdate,
    SalaryUpdate,
    MessageUpdate,
    CreateTaskScene,
    CreateReportScene,
    SendMessageScene,
    CalculateSalaryScene,
  ],
})
export class BotModule implements OnApplicationBootstrap {
  constructor(@InjectBot() private readonly bot: Telegraf<ContextType>) {}

  async onApplicationBootstrap() {
    try {
      const me = await this.bot.telegram.getMe();
      console.log('--------------------------------------------------');
      console.log(`✅ BOT ULANDI: @${me.username} (ID: ${me.id})`);
      console.log('--------------------------------------------------');
    } catch (error) {
      console.error('❌ BOT ULANISHDA XATORLIK:', error);
    }
  }
}
