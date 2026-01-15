import { Injectable } from '@nestjs/common';
import { Action, Ctx, Hears, Update } from 'nestjs-telegraf';
import { MESSAGING } from 'src/common/constants/messages';
import { UserRole } from 'src/common/enum';
import { ContextType } from 'src/common/types';
import { User } from 'src/core/entity/user.entity';
import { UserRepository } from 'src/core/repository/user.repository';
import { MessageService } from 'src/core/services/message.service';
import { InjectRepository } from '@nestjs/typeorm';

@Update()
@Injectable()
export class MessageUpdate {
  constructor(
    private readonly messageService: MessageService,
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}

  @Hears('💬 Xabarlar')
  async messagesMenu(@Ctx() ctx: ContextType) {
    const user = await this.getUser(ctx);

    // Show conversation list
    const conversations = await this.messageService.getConversationsList(
      user.telegram_id,
    );

    if (conversations.length === 0) {
      if (user.role === UserRole.MEMBER) {
        // Employees can mostly only talk to managers who assigned tasks
        // For now, let's keep it simple
        await ctx.reply("Hozircha xabarlar yo'q.");
      } else {
        await ctx.reply(
          MESSAGING.NO_MESSAGES +
            "\n\nXabar yuborish uchun xodimlar ro'yxatidan foydalaning.",
        );
      }
      return;
    }

    let msg = '📬 Sizning suhbatlaringiz:\n\n';
    // Inline keyboard for selecting chats could be added here
    conversations.forEach((c) => {
      msg += `👤 ${c.user_id} (${c.unread_count} yangi)\n`;
    });

    await ctx.reply(msg);
  }

  @Action(/task_message_(.+)/)
  async messageFromTask(@Ctx() _ctx: ContextType) {
    void _ctx;
    // This is handled in TaskUpdate usually, but good to have logic ready
    // Logic handled in TaskUpdate for now.
  }

  private async getUser(ctx: ContextType): Promise<User> {
    return this.userRepo.findOne({ where: { telegram_id: `${ctx.from.id}` } });
  }
}
