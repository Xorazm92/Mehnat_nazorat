import { Injectable } from '@nestjs/common';
import { Action, Ctx, Hears, Update } from 'nestjs-telegraf';
import {
  EMPLOYEE_REPORTS_KEYBOARD,
  REPORTS_MENU_KEYBOARD,
  createReportActionsKeyboard,
} from 'src/common/constants/keyboards';
import { MESSAGES, REPORT_MESSAGES } from 'src/common/constants/messages';
import { ReportStatus, UserRole } from 'src/common/enum';
import { ContextType } from 'src/common/types';
import { Report } from 'src/core/entity/report.entity';
import { User } from 'src/core/entity/user.entity';
import { UserRepository } from 'src/core/repository/user.repository';
import { ReportService } from 'src/core/services/report.service';
import { TaskService } from 'src/core/services/task.service';
import { InjectRepository } from '@nestjs/typeorm';

@Update()
@Injectable()
export class ReportUpdate {
  constructor(
    private readonly reportService: ReportService,
    private readonly taskService: TaskService,
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}

  // --- MENU HANDLERS ---

  @Hears('📝 Hisobotlar') // Manager Menu
  async reportsMenu(@Ctx() ctx: ContextType) {
    const user = await this.getUser(ctx);
    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }
    if (user.role !== UserRole.MANAGER) {
      await ctx.reply(MESSAGES.NO_PERMISSION);
      return;
    }
    await ctx.reply(MESSAGES.CHOOSE_ACTION, REPORTS_MENU_KEYBOARD);
  }

  @Hears('📝 Hisobot yuborish') // Employee Menu
  async employeeReportsMenu(@Ctx() ctx: ContextType) {
    await ctx.reply(MESSAGES.CHOOSE_ACTION, EMPLOYEE_REPORTS_KEYBOARD);
  }

  @Hears('📤 Yangi hisobot') // Employee Action
  async newReport(@Ctx() ctx: ContextType) {
    await ctx.scene.enter('CreateReportScene');
  }

  // --- MANAGER ACTIONS ---

  @Hears('📥 Yangi hisobotlar')
  async newReports(@Ctx() ctx: ContextType) {
    const reports = await this.reportService.getPendingReports();
    if (reports.length === 0) {
      await ctx.reply(REPORT_MESSAGES.NO_REPORTS);
      return;
    }

    for (const report of reports) {
      await this.sendReportDetails(ctx, report, true);
    }
  }

  @Hears(['✅ Tasdiqlangan', '❌ Rad etilgan', '🔄 Qayta ishlash'])
  async filterReports(@Ctx() ctx: ContextType) {
    const statusMap = {
      '✅ Tasdiqlangan': ReportStatus.APPROVED,
      '❌ Rad etilgan': ReportStatus.REJECTED,
      '🔄 Qayta ishlash': ReportStatus.NEEDS_REVISION,
    };
    const status = statusMap[ctx.message.text];
    const reports = await this.reportService.getReportsByStatus(status);

    if (reports.length === 0) {
      await ctx.reply(REPORT_MESSAGES.NO_REPORTS);
      return;
    }

    // Limit to last 5 for cleanliness
    for (const report of reports.slice(0, 5)) {
      await this.sendReportDetails(ctx, report, false);
    }
  }

  // --- EMPLOYEE ACTIONS ---

  @Hears('📊 Yuborilgan hisobotlar')
  async sentReports(@Ctx() ctx: ContextType) {
    const user = await this.getUser(ctx);
    if (!user) {
      await ctx.reply(MESSAGES.ERROR);
      return;
    }
    const reports = await this.reportService.getReportsByEmployee(
      user.telegram_id,
    );

    if (reports.length === 0) {
      await ctx.reply(REPORT_MESSAGES.NO_REPORTS);
      return;
    }

    for (const report of reports.slice(0, 5)) {
      await this.sendReportDetails(ctx, report, false);
    }
  }

  // --- BUTTON ACTIONS ---

  @Action(/report_approve_(.+)/)
  async approveReport(@Ctx() ctx: ContextType) {
    const reportId = ctx.match[1];
    await this.reportService.approveReport(reportId);
    await ctx.answerCbQuery(REPORT_MESSAGES.REPORT_APPROVED);
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });

    // Notify employee (optional implementation)
    const report = await this.reportService.findById(reportId);
    if (report) {
      try {
        await ctx.telegram.sendMessage(
          report.submitted_by,
          `✅ Sizning hisobotingiz tasdiqlandi!`,
        );
      } catch (e) {
        console.log('Error notifying user', e);
      }
    }
  }

  @Action(/report_reject_(.+)/)
  async rejectReport(@Ctx() ctx: ContextType) {
    const reportId = ctx.match[1];
    // Here logic would normally ask for a reason. For simplicity, we just mark as rejected.
    // In a full scene, we'd ask for text input.
    await this.reportService.rejectReport(
      reportId,
      'Admin tomonidan rad etildi',
    );
    await ctx.answerCbQuery('Hisobot rad etildi');
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });

    const report = await this.reportService.findById(reportId);
    if (report) {
      try {
        await ctx.telegram.sendMessage(
          report.submitted_by,
          `❌ Hisobotingiz rad etildi.`,
        );
      } catch (e) {
        console.log('Error notifying user', e);
      }
    }
  }

  @Action(/report_view_(.+)/)
  async viewReport(@Ctx() ctx: ContextType) {
    const reportId = ctx.match[1];
    const report = await this.reportService.findById(reportId);
    if (!report) {
      await ctx.answerCbQuery('Hisobot topilmadi');
      return;
    }

    await ctx.answerCbQuery();
    // Resend details with files if needed, or just text summary
    await this.sendReportDetails(ctx, report, false);
  }

  // --- HELPERS ---

  private async sendReportDetails(
    ctx: ContextType,
    report: Report,
    isActionable: boolean,
  ) {
    const message = REPORT_MESSAGES.REPORT_DETAILS(report);
    const keyboard = isActionable
      ? createReportActionsKeyboard(report.id)
      : undefined;

    await ctx.reply(message, keyboard);

    // Send attached files if any
    if (report.files?.length) {
      for (const fileId of report.files) {
        await ctx.replyWithDocument(fileId);
      }
    }
    if (report.images?.length) {
      for (const imgId of report.images) {
        await ctx.replyWithPhoto(imgId);
      }
    }
  }

  private async getUser(ctx: ContextType): Promise<User | null> {
    return this.userRepo.findOne({ where: { telegram_id: `${ctx.from.id}` } });
  }
}
