import { Injectable } from '@nestjs/common';
import { Ctx, Scene, SceneEnter, Hears, On } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types';
import { ReportService } from 'src/core/services/report.service';
import { TaskService } from 'src/core/services/task.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/entity/user.entity';
import { Repository } from 'typeorm';
import {
  EMPLOYEE_MAIN_KEYBOARD,
  BACK_KEYBOARD,
} from 'src/common/constants/keyboards';
import { REPORT_MESSAGES, MESSAGES } from 'src/common/constants/messages';

@Injectable()
@Scene('CreateReportScene')
export class CreateReportScene {
  private step: Map<number, string> = new Map();

  constructor(
    private readonly reportService: ReportService,
    private readonly taskService: TaskService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  @SceneEnter()
  async onEnter(@Ctx() ctx: ContextType) {
    // If task is already selected (from task action button)
    if (ctx.session.reportTaskId) {
      this.step.set(ctx.from.id, 'text');
      await ctx.reply(REPORT_MESSAGES.ENTER_REPORT, BACK_KEYBOARD);
      return;
    }

    // Otherwise, show user's tasks to select
    const user = await this.userRepository.findOne({
      where: { telegram_id: `${ctx.from.id}` },
    });

    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      await ctx.scene.leave();
      return;
    }

    const tasks = await this.taskService.getTasksByStatus(
      user.telegram_id,
      'pending' as any,
    );

    if (tasks.length === 0) {
      await ctx.reply("Sizda faol vazifalar yo'q!");
      await ctx.scene.leave();
      return;
    }

    let message = REPORT_MESSAGES.SELECT_TASK + '\n\n';
    for (const task of tasks) {
      message += `📋 ${task.id.slice(0, 8)} - ${task.title}\n`;
    }
    message += '\nVazifa ID sini kiriting:';

    this.step.set(ctx.from.id, 'select_task');
    await ctx.reply(message, BACK_KEYBOARD);
  }

  @Hears('🔙 Orqaga')
  async back(@Ctx() ctx: ContextType) {
    await ctx.scene.leave();
    await ctx.reply(MESSAGES.BACK_TO_MAIN, EMPLOYEE_MAIN_KEYBOARD);
  }

  @Hears('❌ Bekor qilish')
  async cancel(@Ctx() ctx: ContextType) {
    await ctx.scene.leave();
    await ctx.reply(MESSAGES.OPERATION_CANCELLED, EMPLOYEE_MAIN_KEYBOARD);
  }

  @Hears('✅ Yuborish')
  async submit(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      await this.createReport(ctx);
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);
    const text = ctx.message.text;

    if (text === '🔙 Orqaga' || text === '❌ Bekor qilish') {
      return;
    }

    switch (currentStep) {
      case 'select_task':
        // Validate task ID
        const task = await this.taskService.findById(text);
        if (!task) {
          await ctx.reply("Vazifa topilmadi. Qaytadan urinib ko'ring:");
          return;
        }

        ctx.session.reportTaskId = text;
        this.step.set(ctx.from.id, 'text');
        await ctx.reply(REPORT_MESSAGES.ENTER_REPORT);
        break;

      case 'text':
        ctx.session.reportText = text;
        this.step.set(ctx.from.id, 'percentage');
        await ctx.reply(REPORT_MESSAGES.COMPLETION_PERCENTAGE);
        break;

      case 'percentage':
        const percentage = parseInt(text);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
          await ctx.reply(MESSAGES.INVALID_INPUT);
          return;
        }

        ctx.session.reportCompletionPercentage = percentage;

        // Confirmation Summary
        const summary = `📝 Hisobot:\n\n` +
          `📄 Matn: ${ctx.session.reportText}\n` +
          `📊 Bajarildi: ${percentage}%\n\n`;

        await ctx.reply(summary);
        this.step.set(ctx.from.id, 'files');

        ctx.session.reportFiles = [];
        ctx.session.reportImages = [];
        ctx.session.reportVideos = [];
        ctx.session.reportAudios = [];

        await ctx.reply(REPORT_MESSAGES.ATTACH_FILES, {
          reply_markup: {
            keyboard: [
              [{ text: '✅ Yuborish' }],
              [{ text: '❌ Bekor qilish' }],
            ],
            resize_keyboard: true,
          },
        });
        break;
    }
  }



  @On('document')
  async onDocument(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.document.file_id;
      if (!ctx.session.reportFiles) ctx.session.reportFiles = [];
      ctx.session.reportFiles.push(fileId);
      await ctx.reply("✅ Hujjat qo'shildi.");
    }
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      if (!ctx.session.reportImages) ctx.session.reportImages = [];
      ctx.session.reportImages.push(fileId);
      await ctx.reply("✅ Rasm qo'shildi.");
    }
  }

  @On('video')
  async onVideo(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.video.file_id;
      if (!ctx.session.reportVideos) ctx.session.reportVideos = [];
      ctx.session.reportVideos.push(fileId);
      await ctx.reply("✅ Video qo'shildi.");
    }
  }

  @On('audio')
  async onAudio(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.audio.file_id;
      if (!ctx.session.reportAudios) ctx.session.reportAudios = [];
      ctx.session.reportAudios.push(fileId);
      await ctx.reply("✅ Audio qo'shildi.");
    }
  }

  @On('voice')
  async onVoice(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);

    if (currentStep === 'files') {
      const fileId = ctx.message.voice.file_id;
      if (!ctx.session.reportAudios) ctx.session.reportAudios = [];
      ctx.session.reportAudios.push(fileId);
      await ctx.reply("✅ Ovozli xabar qo'shildi.");
    }
  }

  private async createReport(@Ctx() ctx: ContextType) {
    try {
      const user = await this.userRepository.findOne({
        where: { telegram_id: `${ctx.from.id}` },
      });

      if (!user) {
        await ctx.reply(MESSAGES.ERROR);
        return;
      }

      await this.reportService.createReport({
        task_id: ctx.session.reportTaskId,
        submitted_by: user.telegram_id,
        report_text: ctx.session.reportText,
        completion_percentage: ctx.session.reportCompletionPercentage,
        files: ctx.session.reportFiles || [],
        images: ctx.session.reportImages || [],
        videos: ctx.session.reportVideos || [],
        audios: ctx.session.reportAudios || [],
      });

      await ctx.reply(REPORT_MESSAGES.REPORT_SUBMITTED, EMPLOYEE_MAIN_KEYBOARD);

      // Notify manager
      const task = await this.taskService.findById(ctx.session.reportTaskId);
      if (task) {
        try {
          await ctx.telegram.sendMessage(
            task.assigned_by,
            REPORT_MESSAGES.NEW_REPORT(
              `${user.first_name} ${user.last_name}`,
              task.title,
            ),
          );
        } catch (error) {
          console.log('Failed to notify manager:', error);
        }
      }

      // Update task status to in_progress if it was pending
      if (task.status === 'pending') {
        await this.taskService.updateStatus(task.id, 'in_progress' as any);
      }

      await ctx.scene.leave();
      this.step.delete(ctx.from.id);

      // Clear session
      ctx.session.reportTaskId = null;
      ctx.session.reportText = null;
      ctx.session.reportFiles = [];
      ctx.session.reportImages = [];
      ctx.session.reportVideos = [];
      ctx.session.reportAudios = [];
      ctx.session.reportCompletionPercentage = 0;
    } catch (error) {
      console.error('Error creating report:', error);
      await ctx.reply(MESSAGES.ERROR);
    }
  }
}
