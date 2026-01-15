import { InjectRepository } from '@nestjs/typeorm';
import { Command, Ctx, Update, Hears } from 'nestjs-telegraf';
import { UserStatus, UserRole } from 'src/common/enum';
import { ContextType } from 'src/common/types';
import { User } from 'src/core/entity/user.entity';
import { UserRepository } from 'src/core/repository/user.repository';
import {
  MANAGER_MAIN_KEYBOARD,
  EMPLOYEE_MAIN_KEYBOARD,
} from 'src/common/constants/keyboards';
import { MESSAGES } from 'src/common/constants/messages';
import { adminMenu, mainMessageAdmin } from 'src/common/constants/admin';

@Update()
export class BotUpdate {
  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}

  @Command('start')
  async start(@Ctx() ctx: ContextType) {
    try {
      console.log(`Start received from ${ctx.from.id}`);

      const user = await this.userRepo.findOne({
        where: { telegram_id: `${ctx.from.id}` },
      });

      if (!user) {
        await ctx.scene.enter('RegisterScene');
        return;
      }

      if (user.status == UserStatus.INACTIVE) {
        await ctx.reply('⏳ Iltimos adminlar ruxsatini kuting!');
        return;
      }

      await this.showMainMenu(ctx, user);
    } catch (error) {
      console.error('Error in start command:', error);
      await ctx.reply("Xatolik yuz berdi. Qayta urinib ko'ring.");
    }
  }

  @Hears('🏠 Bosh menyu')
  async homeButton(@Ctx() ctx: ContextType) {
    await this.start(ctx);
  }

  @Hears('🛠 Admin panel')
  async adminPanelButton(@Ctx() ctx: ContextType) {
    const user = await this.userRepo.findOne({
      where: { telegram_id: `${ctx.from.id}` },
    });

    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }

    if (user.role !== UserRole.MANAGER) {
      await ctx.reply(MESSAGES.NO_PERMISSION);
      return;
    }

    await ctx.reply(mainMessageAdmin, { reply_markup: adminMenu });
  }

  @Hears('🔙 Orqaga')
  async backToMain(@Ctx() ctx: ContextType) {
    const user = await this.userRepo.findOne({
      where: { telegram_id: `${ctx.from.id}` },
    });

    if (user) {
      await this.showMainMenu(ctx, user);
    }
  }

  private async showMainMenu(@Ctx() ctx: ContextType, user: User) {
    const greeting = `👋 Xush kelibsiz, ${user.first_name}!\n\n${MESSAGES.WELCOME}`;

    if (user.role === UserRole.MANAGER) {
      await ctx.reply(greeting, MANAGER_MAIN_KEYBOARD);
    } else {
      await ctx.reply(greeting, EMPLOYEE_MAIN_KEYBOARD);
    }
  }
}
