import { Injectable } from '@nestjs/common';
import { Ctx, Scene, SceneEnter, Hears, On } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types';
import { MessageService } from 'src/core/services/message.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/entity/user.entity';
import { Repository } from 'typeorm';
import {
  BACK_KEYBOARD,
  MANAGER_MAIN_KEYBOARD,
  EMPLOYEE_MAIN_KEYBOARD,
} from 'src/common/constants/keyboards';
import { MESSAGING, MESSAGES } from 'src/common/constants/messages';
import { UserRole } from 'src/common/enum';

@Injectable()
@Scene('SendMessageScene')
export class SendMessageScene {
  private step: Map<number, string> = new Map();

  constructor(
    private readonly messageService: MessageService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @SceneEnter()
  async onEnter(@Ctx() ctx: ContextType) {
    if (ctx.session.messageRecipient) {
      this.step.set(ctx.from.id, 'text');
      await ctx.reply(MESSAGING.ENTER_MESSAGE, BACK_KEYBOARD);
      return;
    }

    // If no recipient selected, ask based on role
    // For simplicity, we assume context is usually set before entering,
    // or we can implement a user picker here.
    await ctx.reply(
      "Qabul qiluvchi tanlanmagan. Iltimos qaytadan urinib ko'ring.",
      BACK_KEYBOARD,
    );
    await ctx.scene.leave();
  }

  @Hears('🔙 Orqaga')
  async back(@Ctx() ctx: ContextType) {
    await ctx.scene.leave();
    const user = await this.userRepository.findOne({
      where: { telegram_id: `${ctx.from.id}` },
    });

    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }

    if (user.role === UserRole.MANAGER) {
      await ctx.reply(MESSAGES.BACK_TO_MAIN, MANAGER_MAIN_KEYBOARD);
    } else {
      await ctx.reply(MESSAGES.BACK_TO_MAIN, EMPLOYEE_MAIN_KEYBOARD);
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);
    const text = ctx.message.text;

    if (text === '🔙 Orqaga') return;

    if (currentStep === 'text') {
      // Send message
      try {
        const sender = await this.userRepository.findOne({
          where: { telegram_id: `${ctx.from.id}` },
        });

        if (!sender) {
          await ctx.reply(MESSAGES.ERROR);
          return;
        }
        const recipientId = ctx.session.messageRecipient;

        await this.messageService.createMessage({
          from_user: sender.telegram_id,
          to_user: recipientId,
          text: text,
          task_id: ctx.session.selectedTask, // Optional
          message_type: 'text',
        });

        // Tiwg'ridan-to'gri Telegram orqali yuborish
        await ctx.telegram.sendMessage(
          recipientId,
          `${MESSAGING.NEW_MESSAGE(`${sender.first_name} ${sender.last_name}`)}:\n\n${text}`,
        );

        await ctx.reply(MESSAGING.MESSAGE_SENT);
        await ctx.scene.leave();
        this.step.delete(ctx.from.id);
      } catch (e) {
        console.error('Error sending message', e);
        await ctx.reply(MESSAGES.ERROR);
      }
    }
  }

  // Handling media would be similar to other scenes (photo, document, etc)
}
