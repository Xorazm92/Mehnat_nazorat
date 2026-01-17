import { Injectable } from '@nestjs/common';
import { Ctx, Hears, Update, Action } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types';
import { TaskService } from 'src/core/services/task.service';
import { ReportService } from 'src/core/services/report.service';
import { UserRole } from 'src/common/enum';
import {
  TASKS_MENU_KEYBOARD,
  EMPLOYEE_TASKS_KEYBOARD,
  createTaskActionsKeyboard,
  BACK_KEYBOARD,
} from 'src/common/constants/keyboards';
import { TASK_MESSAGES, MESSAGES } from 'src/common/constants/messages';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/entity/user.entity';
import { Repository } from 'typeorm';

@Update()
@Injectable()
export class TaskUpdate {
  constructor(
    private readonly taskService: TaskService,
    private readonly reportService: ReportService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Rahbar - Vazifalar menyu
  @Hears('📋 Vazifalar')
  async tasksMenu(@Ctx() ctx: ContextType) {
    const user = await this.getUserFromContext(ctx);

    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }

    if (user.role !== UserRole.MANAGER) {
      await ctx.reply(MESSAGES.NO_PERMISSION);
      return;
    }

    await ctx.reply(MESSAGES.CHOOSE_ACTION, TASKS_MENU_KEYBOARD);
  }

  // Xodim - Mening vazifalarim
  @Hears('📋 Mening vazifalarim')
  async myTasks(@Ctx() ctx: ContextType) {
    await ctx.reply(MESSAGES.CHOOSE_ACTION, EMPLOYEE_TASKS_KEYBOARD);
  }

  // Yangi vazifa yaratish - boshlash
  @Hears('➕ Yangi vazifa')
  async createTaskStart(@Ctx() ctx: ContextType) {
    const user = await this.getUserFromContext(ctx);

    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }

    if (user.role !== UserRole.MANAGER) {
      await ctx.reply(MESSAGES.NO_PERMISSION);
      return;
    }

    ctx.session.taskTitle = null;
    ctx.session.taskDescription = null;
    ctx.session.taskDeadline = null;
    ctx.session.taskPriority = null;
    ctx.session.taskAssignedTo = null;
    ctx.session.taskFiles = [];
    ctx.session.taskImages = [];
    ctx.session.taskVideos = [];
    ctx.session.taskAudios = [];

    await ctx.reply(TASK_MESSAGES.CREATE_TITLE, BACK_KEYBOARD);
    await ctx.scene.enter('CreateTaskScene');
  }

  // Faol vazifalar
  @Hears(['⏳ Faol vazifalar', '⏳ Kutilayotgan'])
  async activeTasks(@Ctx() ctx: ContextType) {
    const user = await this.getUserFromContext(ctx);
    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }
    const tasks = await this.taskService.getTasksByStatus(
      user.telegram_id,
      'pending' as any,
    );

    if (tasks.length === 0) {
      await ctx.reply(TASK_MESSAGES.NO_TASKS);
      return;
    }

    for (const task of tasks) {
      const message = TASK_MESSAGES.TASK_DETAILS(task);
      await ctx.reply(message, createTaskActionsKeyboard(task.id));
    }
  }

  // Tugallangan vazifalar
  @Hears('✅ Tugallangan')
  async completedTasks(@Ctx() ctx: ContextType) {
    const user = await this.getUserFromContext(ctx);
    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }
    const tasks = await this.taskService.getTasksByStatus(
      user.telegram_id,
      'completed' as any,
    );

    if (tasks.length === 0) {
      await ctx.reply(TASK_MESSAGES.NO_TASKS);
      return;
    }

    for (const task of tasks) {
      const message = TASK_MESSAGES.TASK_DETAILS(task);
      await ctx.reply(message);
    }
  }

  // Muddati o'tgan vazifalar
  @Hears("⚠️ Muddati o'tgan")
  async overdueTasks(@Ctx() ctx: ContextType) {
    const user = await this.getUserFromContext(ctx);
    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }
    const tasks = await this.taskService.getOverdueTasks(user.telegram_id);

    if (tasks.length === 0) {
      await ctx.reply("✅ Muddati o'tgan vazifalar yo'q!");
      return;
    }

    await ctx.reply(TASK_MESSAGES.OVERDUE_WARNING(tasks.length));

    for (const task of tasks) {
      const message = TASK_MESSAGES.TASK_DETAILS(task);
      await ctx.reply(message, createTaskActionsKeyboard(task.id));
    }
  }

  // Shoshilinch vazifalar
  @Hears('🔥 Shoshilinch')
  async urgentTasks(@Ctx() ctx: ContextType) {
    const user = await this.getUserFromContext(ctx);
    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }
    const tasks = await this.taskService.getUrgentTasks(user.telegram_id);

    if (tasks.length === 0) {
      await ctx.reply("✅ Shoshilinch vazifalar yo'q!");
      return;
    }

    for (const task of tasks) {
      const message = TASK_MESSAGES.TASK_DETAILS(task);
      await ctx.reply(message, createTaskActionsKeyboard(task.id));
    }
  }

  // Bugungi vazifalar
  @Hears('📅 Bugungi')
  async todayTasks(@Ctx() ctx: ContextType) {
    const user = await this.getUserFromContext(ctx);
    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }
    const tasks = await this.taskService.getTodayTasks(user.telegram_id);

    if (tasks.length === 0) {
      await ctx.reply("📭 Bugungi vazifalar yo'q!");
      return;
    }

    for (const task of tasks) {
      const message = TASK_MESSAGES.TASK_DETAILS(task);
      await ctx.reply(message, createTaskActionsKeyboard(task.id));
    }
  }

  // Barcha vazifalar (rahbar uchun)
  @Hears('📊 Barcha vazifalar')
  async allTasks(@Ctx() ctx: ContextType) {
    const user = await this.getUserFromContext(ctx);

    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }

    if (user.role !== UserRole.MANAGER) {
      await ctx.reply(MESSAGES.NO_PERMISSION);
      return;
    }

    const tasks = await this.taskService.getTasksByManager(user.telegram_id);

    if (tasks.length === 0) {
      await ctx.reply(TASK_MESSAGES.NO_TASKS);
      return;
    }

    let message = '📊 Barcha vazifalar:\n\n';
    for (const task of tasks.slice(0, 10)) {
      message += `📋 ${task.title}\n`;
      message += `👤 ${task.assigned_to}\n`;
      message += `📊 ${task.status}\n`;
      message += `━━━━━━━━━━━━\n`;
    }

    await ctx.reply(message);
  }

  // Vazifani bajarildi deb belgilash
  @Action(/task_complete_(.+)/)
  async completeTask(@Ctx() ctx: ContextType) {
    const taskId = ctx.match[1];

    await this.taskService.updateStatus(taskId, 'completed' as any);
    await ctx.answerCbQuery(TASK_MESSAGES.TASK_COMPLETED);
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  }

  // Vazifa tafsilotlari
  @Action(/task_details_(.+)/)
  async taskDetails(@Ctx() ctx: ContextType) {
    const taskId = ctx.match[1];
    const task = await this.taskService.findById(taskId);

    if (!task) {
      await ctx.answerCbQuery('Vazifa topilmadi');
      return;
    }

    const message = TASK_MESSAGES.TASK_DETAILS(task);
    await ctx.answerCbQuery();
    await ctx.reply(message);
  }

  // Vazifa bo'yicha hisobot yuborish
  @Action(/task_report_(.+)/)
  async taskReport(@Ctx() ctx: ContextType) {
    const taskId = ctx.match[1];
    ctx.session.reportTaskId = taskId;

    await ctx.answerCbQuery();
    await ctx.scene.enter('CreateReportScene');
  }

  // Vazifa bo'yicha xabar yuborish
  @Action(/task_message_(.+)/)
  async taskMessage(@Ctx() ctx: ContextType) {
    const taskId = ctx.match[1];
    const task = await this.taskService.findById(taskId);

    if (!task) {
      await ctx.answerCbQuery('Vazifa topilmadi');
      return;
    }

    const user = await this.getUserFromContext(ctx);
    if (!user) {
      await ctx.answerCbQuery(MESSAGES.ERROR);
      return;
    }
    const recipientId =
      user.telegram_id === task.assigned_to
        ? task.assigned_by
        : task.assigned_to;

    ctx.session.messageRecipient = recipientId;
    ctx.session.conversationWith = recipientId;

    await ctx.answerCbQuery();
    await ctx.scene.enter('SendMessageScene');
  }

  // Yordamchi funksiya
  private async getUserFromContext(ctx: ContextType): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { telegram_id: `${ctx.from.id}` },
    });
  }
}
