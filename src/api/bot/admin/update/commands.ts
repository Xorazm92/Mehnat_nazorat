import { InjectRepository } from '@nestjs/typeorm';
import { Update, Command, Ctx } from 'nestjs-telegraf';
import { mainMessageAdmin, adminMenu } from 'src/common/constants/admin';
import { MESSAGES } from 'src/common/constants/messages';
import { ContextType } from 'src/common/types';
import { UserRole, UserStatus } from 'src/common/enum';
import { User } from 'src/core/entity/user.entity';
import { UserRepository } from 'src/core/repository/user.repository';

@Update()
export class AdminCommands {
  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}

  @Command('admin')
  async admin(@Ctx() ctx: ContextType) {
    const user = await this.userRepo.findOne({
      where: { telegram_id: `${ctx.from.id}` },
    });

    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }

    if (user.status === UserStatus.INACTIVE) {
      await ctx.reply('⏳ Iltimos adminlar ruxsatini kuting!');
      return;
    }

    if (user.role !== UserRole.MANAGER) {
      await ctx.reply(MESSAGES.NO_PERMISSION);
      return;
    }

    await ctx.reply(mainMessageAdmin, { reply_markup: adminMenu });
  }
}
