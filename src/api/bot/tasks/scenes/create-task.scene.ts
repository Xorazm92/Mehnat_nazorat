import { Injectable } from '@nestjs/common';
import { Ctx, Scene, SceneEnter, Hears, On } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types';
import { TaskService } from 'src/core/services/task.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/entity/user.entity';
import { Repository } from 'typeorm';
import {
  PRIORITY_KEYBOARD,
  BACK_KEYBOARD,
  MANAGER_MAIN_KEYBOARD,
} from 'src/common/constants/keyboards';
import { TASK_MESSAGES, MESSAGES } from 'src/common/constants/messages';
import { TaskPriority } from 'src/common/enum';

@Injectable()
@Scene('CreateTaskScene')
export class CreateTaskScene {
  private step: Map<number, string> = new Map();

  constructor(
    private readonly taskService: TaskService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  @SceneEnter()
  async onEnter(@Ctx() ctx: ContextType) {
    this.step.set(ctx.from.id, 'title');
    await ctx.reply(TASK_MESSAGES.CREATE_TITLE, BACK_KEYBOARD);
  }

  @Hears('🔙 Orqaga')
  async back(@Ctx() ctx: ContextType) {
    await ctx.scene.leave();
    await ctx.reply(MESSAGES.BACK_TO_MAIN, MANAGER_MAIN_KEYBOARD);
  }

  @Hears('❌ Bekor qilish')
  async cancel(@Ctx() ctx: ContextType) {
    await ctx.scene.leave();
    await ctx.reply(MESSAGES.OPERATION_CANCELLED, MANAGER_MAIN_KEYBOARD);
  }

  @Hears('✅ Davom etish')
  async continue(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);
    console.log(`DEBUG: continue triggered. Step: ${currentStep}, User: ${ctx.from.id}`);

    if (currentStep === 'files') {
      console.log('DEBUG: calling createTask');
      await this.createTask(ctx);
    } else {
      console.log('DEBUG: step mismatch, expected files');
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);
    const text = ctx.message.text;

    switch (currentStep) {
      case 'title':
        ctx.session.taskTitle = text;
        this.step.set(ctx.from.id, 'description');
        await ctx.reply(TASK_MESSAGES.CREATE_DESCRIPTION);
        break;

      case 'description':
        ctx.session.taskDescription = text;
        this.step.set(ctx.from.id, 'deadline');
        await ctx.reply(TASK_MESSAGES.CREATE_DEADLINE);
        break;

      case 'deadline':
        // Validate and parse date
        const deadline = this.parseDate(text);
        if (!deadline) {
          await ctx.reply(MESSAGES.INVALID_INPUT);
          return;
        }
        ctx.session.taskDeadline = deadline.toISOString();
        this.step.set(ctx.from.id, 'priority');
        await ctx.reply(TASK_MESSAGES.CREATE_PRIORITY, PRIORITY_KEYBOARD);
        break;

      case 'employee':
        // Find employee by name or telegram_id
        const employee = await this.userRepository.findOne({
          where: { telegram_id: text },
        });

        if (!employee) {
          await ctx.reply("Xodim topilmadi. Qaytadan urinib ko'ring:");
          return;
        }

        ctx.session.taskAssignedTo = employee.telegram_id;
        this.step.set(ctx.from.id, 'files');
        await ctx.reply(TASK_MESSAGES.ATTACH_FILES, {
          reply_markup: {
            keyboard: [
              [{ text: '✅ Davom etish' }],
              [{ text: '❌ Bekor qilish' }],
            ],
            resize_keyboard: true,
          },
        });
        break;
    }
  }

  @On('callback_query')
  async onCallback(@Ctx() ctx: ContextType) {
    const data = ctx.callbackQuery['data'];

    // Priority selection
    if (data.startsWith('priority_')) {
      const priority = data.replace('priority_', '') as TaskPriority;
      ctx.session.taskPriority = priority;

      await ctx.answerCbQuery();
      this.step.set(ctx.from.id, 'employee');

      // Get all employees
      const employees = await this.userRepository.find({
        where: { role: 'member' as any },
      });

      if (employees.length === 0) {
        await ctx.reply("Xodimlar topilmadi.");
        return;
      }

      const buttons = [];
      let row = [];

      for (const emp of employees) {
        row.push({
          text: `${emp.first_name} ${emp.last_name}`,
          callback_data: `select_emp_${emp.telegram_id}`,
        });

        if (row.length === 2) {
          buttons.push(row);
          row = [];
        }
      }

      if (row.length > 0) {
        buttons.push(row);
      }

      await ctx.reply(
        TASK_MESSAGES.SELECT_EMPLOYEE,
        {
          reply_markup: {
            inline_keyboard: buttons,
          },
        },
      );
    } else if (data.startsWith('select_emp_')) {
      const employeeId = data.replace('select_emp_', '');

      const employee = await this.userRepository.findOne({
        where: { telegram_id: employeeId },
      });

      if (!employee) {
        await ctx.answerCbQuery("Xodim topilmadi");
        return;
      }

      ctx.session.taskAssignedTo = employee.telegram_id;
      await ctx.answerCbQuery(`Tanlandi: ${employee.first_name}`);

      this.step.set(ctx.from.id, 'files');
      await ctx.editMessageText(
        `✅ Xodim tanlandi: ${employee.first_name} ${employee.last_name}\n\n${TASK_MESSAGES.ATTACH_FILES}`,
      );
      await ctx.reply("Fayllarni yuboring yoki 'Davom etish' tugmasini bosing:", {
        reply_markup: {
          keyboard: [
            [{ text: '✅ Davom etish' }],
            [{ text: '❌ Bekor qilish' }],
          ],
          resize_keyboard: true,
        },
      });
    }
  }



  @On('document')
  async onDocument(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.document.file_id;
      if (!ctx.session.taskFiles) ctx.session.taskFiles = [];
      ctx.session.taskFiles.push(fileId);
      await ctx.reply(
        '✅ Fayl qo\'shildi. Yana fayl yuborishingiz yoki "Davom etish" tugmasini bosishingiz mumkin.',
      );
    } else {
      await ctx.reply("⚠️ Iltimos, hozirgi bosqichda faqat matn kiriting. Fayllarni oxirgi bosqichda yuklashingiz mumkin.");
    }
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      if (!ctx.session.taskImages) ctx.session.taskImages = [];
      ctx.session.taskImages.push(fileId);
      await ctx.reply("✅ Rasm qo'shildi.");
    }
  }

  @On('video')
  async onVideo(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.video.file_id;
      if (!ctx.session.taskVideos) ctx.session.taskVideos = [];
      ctx.session.taskVideos.push(fileId);
      await ctx.reply("✅ Video qo'shildi.");
    }
  }

  @On('audio')
  async onAudio(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.audio.file_id;
      if (!ctx.session.taskAudios) ctx.session.taskAudios = [];
      ctx.session.taskAudios.push(fileId);
      await ctx.reply("✅ Audio qo'shildi.");
    } else {
      await ctx.reply("⚠️ Iltimos, hozirgi bosqichda faqat matn kiriting. Audiolarni oxirgi bosqichda yuklashingiz mumkin.");
    }
  }

  @On('voice')
  async onVoice(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.voice.file_id;
      if (!ctx.session.taskAudios) ctx.session.taskAudios = [];
      ctx.session.taskAudios.push(fileId);
      await ctx.reply("✅ Ovozli xabar qo'shildi.");
    }
  }

  private async createTask(@Ctx() ctx: ContextType) {
    console.log('DEBUG: inside createTask');
    try {
      const user = await this.userRepository.findOne({
        where: { telegram_id: `${ctx.from.id}` },
      });

      if (!user) {
        await ctx.reply(MESSAGES.ERROR);
        return;
      }

      const task = await this.taskService.createTask({
        title: ctx.session.taskTitle,
        description: ctx.session.taskDescription,
        deadline: new Date(ctx.session.taskDeadline),
        priority: ctx.session.taskPriority as any,
        assigned_by: user.telegram_id,
        assigned_to: ctx.session.taskAssignedTo,
        files: ctx.session.taskFiles || [],
        images: ctx.session.taskImages || [],
        videos: ctx.session.taskVideos || [],
        audios: ctx.session.taskAudios || [],
        department: user.department,
      });

      await ctx.reply(
        TASK_MESSAGES.TASK_CREATED(task.id),
        MANAGER_MAIN_KEYBOARD,
      );

      // Notify employee
      try {
        await ctx.telegram.sendMessage(
          ctx.session.taskAssignedTo,
          TASK_MESSAGES.TASK_ASSIGNED(task.title, task.deadline.toString()),
        );

        // Forward attachments (best-effort)
        if (task.files?.length) {
          for (const fileId of task.files) {
            try {
              await ctx.telegram.sendDocument(
                ctx.session.taskAssignedTo,
                fileId,
              );
            } catch (e) {
              console.log('Failed to send task document:', e);
            }
          }
        }

        if (task.images?.length) {
          for (const imgId of task.images) {
            try {
              await ctx.telegram.sendPhoto(ctx.session.taskAssignedTo, imgId);
            } catch (e) {
              console.log('Failed to send task photo:', e);
            }
          }
        }

        if (task.videos?.length) {
          for (const videoId of task.videos) {
            try {
              await ctx.telegram.sendVideo(ctx.session.taskAssignedTo, videoId);
            } catch (e) {
              console.log('Failed to send task video:', e);
            }
          }
        }

        if (task.audios?.length) {
          for (const audioId of task.audios) {
            try {
              await ctx.telegram.sendAudio(ctx.session.taskAssignedTo, audioId);
            } catch (e) {
              console.log('Failed to send task audio:', e);
            }
          }
        }
      } catch (error) {
        console.log('Failed to notify employee:', error);
      }

      await ctx.scene.leave();
      this.step.delete(ctx.from.id);
    } catch (error) {
      console.error('Error creating task:', error);
      await ctx.reply(MESSAGES.ERROR);
    }
  }

  private parseDate(dateStr: string): Date | null {
    try {
      // Format: DD.MM.YYYY HH:MM
      const parts = dateStr.split(' ');
      const dateParts = parts[0].split('.');
      const timeParts = parts[1]?.split(':') || ['00', '00'];

      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const year = parseInt(dateParts[2]);
      const hour = parseInt(timeParts[0]);
      const minute = parseInt(timeParts[1]);

      const date = new Date(year, month, day, hour, minute);

      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch {
      return null;
    }
  }
}
