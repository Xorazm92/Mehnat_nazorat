import { InjectRepository } from '@nestjs/typeorm';
import { Update, Action, Ctx, On } from 'nestjs-telegraf';
import { User } from 'src/core/entity/user.entity';
import { UserRepository } from 'src/core/repository/user.repository';
import {
  mainMessageAdmin,
  waitingUsersMessage,
  allUsersMessage,
  adminMenu,
  organizationKeys,
  reportsKeys,
  deadlinesKeys,
  notificationsKeys,
  manageUsersKeys,
  newsKeys,
  manageDepartmentKeys,
  organizationsSummaryMessage,
  reportsSummaryMessage,
  deadlinesSummaryMessage,
  notificationsSummaryMessage,
} from 'src/common/constants/admin';
import { ContextType } from 'src/common/types';
import { UserStatus } from 'src/common/enum';
import { OrganizationService } from 'src/core/services/organization.service';
import { ReportSubmissionService } from 'src/core/services/report-submission.service';
import { DeadlineService } from 'src/core/services/deadline.service';
import { NotificationService } from 'src/core/services/notification.service';

@Update()
export class AdminMenuActions {
  constructor(
    @InjectRepository(User) private readonly userRepo: UserRepository,
    private readonly organizationService: OrganizationService,
    private readonly reportSubmissionService: ReportSubmissionService,
    private readonly deadlineService: DeadlineService,
    private readonly notificationService: NotificationService,
  ) {}

  private reportDetailMessages = new Map<
    number,
    { chatId: number; messageId: number }
  >();

  private reportPromptMessages = new Map<
    number,
    { chatId: number; messageId: number }
  >();

  private deadlineDetailMessages = new Map<
    number,
    { chatId: number; messageId: number }
  >();

  private notificationDetailMessages = new Map<
    number,
    { chatId: number; messageId: number }
  >();

  private pendingReportActions = new Map<
    number,
    { reportId: string; type: 'reject' | 'revise' }
  >();
  @Action('manageUsers')
  async manageUsers(@Ctx() ctx: ContextType) {
    const countOfNotRegisteredUsers = await this.userRepo.count({
      where: { status: UserStatus.INACTIVE },
    });
    const countOfRegisteredUsers = await this.userRepo.count({
      where: { status: UserStatus.ACTIVE },
    });
    await ctx.editMessageText(
      waitingUsersMessage +
        countOfNotRegisteredUsers +
        '\n' +
        allUsersMessage +
        countOfRegisteredUsers,
      {
        reply_markup: manageUsersKeys,
      },
    );
  }

  @Action('news')
  async news(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(mainMessageAdmin, { reply_markup: newsKeys });
  }

  @Action('departmentSettings')
  async departmentSettings(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(mainMessageAdmin, {
      reply_markup: manageDepartmentKeys,
    });
  }

  @Action('organizations')
  async organizations(@Ctx() ctx: ContextType) {
    const organizations = await this.organizationService.findAll();
    const summaryText = organizationsSummaryMessage({
      total: organizations.length,
      active: organizations.filter((org) => org.is_active).length,
      withoutInspector: organizations.filter(
        (org) => !org.assigned_inspector_id,
      ).length,
    });

    await ctx.editMessageText(summaryText, {
      parse_mode: 'HTML',
      reply_markup: organizationKeys(),
    });
  }

  @Action('reportsOverview')
  async reportsOverview(@Ctx() ctx: ContextType) {
    const stats = await this.reportSubmissionService.getStatistics();
    const summaryText = reportsSummaryMessage({
      pending: stats.by_status.pending,
      approved: stats.by_status.approved,
      rejected: stats.by_status.rejected,
      overdue: stats.late_count,
    });

    await ctx.editMessageText(summaryText, {
      parse_mode: 'HTML',
      reply_markup: reportsKeys(),
    });
  }

  @Action('deadlinesOverview')
  async deadlinesOverview(@Ctx() ctx: ContextType) {
    const upcoming = await this.deadlineService.getUpcoming();
    const overdue = await this.deadlineService.getOverdue();
    const summaryText = deadlinesSummaryMessage({
      upcoming: upcoming.length,
      overdue: overdue.length,
      completed: await this.deadlineService.countCompleted(),
    });

    await ctx.editMessageText(summaryText, {
      parse_mode: 'HTML',
      reply_markup: deadlinesKeys(),
    });
  }

  @Action('notificationsOverview')
  async notificationsOverview(@Ctx() ctx: ContextType) {
    const total = await this.notificationService.countAll();
    const unread = await this.notificationService.countUnread();
    const summaryText = notificationsSummaryMessage({
      unread,
      total,
    });

    await ctx.editMessageText(summaryText, {
      parse_mode: 'HTML',
      reply_markup: notificationsKeys(),
    });
  }

  @Action('listOrganizations')
  async listOrganizations(@Ctx() ctx: ContextType) {
    const organizations = await this.organizationService.findAll();

    if (!organizations.length) {
      await ctx.editMessageText('🏢 Hali tashkilotlar qo‘shilmagan.', {
        reply_markup: organizationKeys(),
      });
      return;
    }

    const preview = organizations.slice(0, 15);
    const content = preview
      .map((org, index) => {
        const inspectorName = org.assigned_inspector
          ? `${org.assigned_inspector.first_name} ${org.assigned_inspector.last_name ?? ''}`.trim()
          : '—';
        return `${index + 1}. <b>${org.short_name}</b> (${org.code})\n   👤 Inspektor: ${inspectorName}`;
      })
      .join('\n\n');

    const footer =
      organizations.length > preview.length
        ? `\n\n... va yana ${organizations.length - preview.length} ta tashkilot`
        : '';

    await ctx.editMessageText(
      `<b>Tashkilotlar ro‘yxati</b>\n\n${content}${footer}`,
      {
        parse_mode: 'HTML',
        reply_markup: organizationKeys({
          extraRows: this.chunkButtons(
            preview.map((org) => ({
              text: org.short_name,
              data: `organizationDetails:${org.id}`,
            })),
          ),
        }),
      },
    );
  }

  @Action(/organizationDetails:(.+)/)
  async organizationDetails(@Ctx() ctx: ContextType) {
    const orgId = ctx.match?.[1];
    if (!orgId) {
      await ctx.answerCbQuery('Tashkilot topilmadi');
      return;
    }

    const organization = await this.organizationService.findById(orgId);
    if (!organization) {
      await ctx.answerCbQuery('Tashkilot mavjud emas');
      return;
    }

    const [reportStats, pendingReports, deadlineStats, upcomingDeadlines] =
      await Promise.all([
        this.reportSubmissionService.getStatistics({
          organization_id: organization.id,
        }),
        this.reportSubmissionService.getPendingByOrganization(organization.id, 3),
        this.deadlineService.getStatsByOrganization(organization.id),
        this.deadlineService.getUpcomingByOrganization(organization.id, 3),
      ]);

    const organizationInfo = [
      `<b>${organization.short_name}</b> (${organization.code})`,
      organization.full_name,
      `🏛️ Turi: ${organization.type}`,
      `👤 Mas’ul shaxs: ${this.formatUserName(organization.responsible_person)}`,
      `👮 Inspektor: ${this.formatUserName(organization.assigned_inspector)}`,
      `☎️ ${organization.phone ?? '—'}`,
      `📧 ${organization.email ?? '—'}`,
      `📍 ${organization.address ?? '—'}`,
    ].join('\n');

    const reportsBlock = [
      `<b>Hisobotlar</b>`,
      `• Jami: ${reportStats.total}`,
      `• Pending: ${reportStats.by_status.pending ?? 0}`,
      `• Tasdiqlangan: ${reportStats.by_status.approved ?? 0}`,
      `• Rad etilgan: ${reportStats.by_status.rejected ?? 0}`,
      `• Kechikkan: ${reportStats.late_count ?? 0}`,
      pendingReports.length
        ? '\n<b>Aktual hisobotlar:</b>\n' +
          pendingReports
            .map(
              (report, index) =>
                `${index + 1}. ${report.title} — yuborilgan ${this.formatDate(
                  report.submitted_at,
                )}`,
            )
            .join('\n')
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    const deadlinesBlock = [
      `<b>Deadline’lar</b>`,
      `• Jami: ${deadlineStats.total}`,
      `• Pending: ${deadlineStats.pending}`,
      `• Yaqin 30 kun: ${deadlineStats.upcoming30}`,
      `• Kechikkan: ${deadlineStats.overdue}`,
      `• Yakunlangan: ${deadlineStats.completed}`,
      upcomingDeadlines.length
        ? '\n<b>Yaqin muddatlar:</b>\n' +
          upcomingDeadlines
            .map(
              (deadline, index) =>
                `${index + 1}. ${deadline.title} — ${this.formatDate(
                  deadline.due_date,
                )}`,
            )
            .join('\n')
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    await ctx.editMessageText(
      `${organizationInfo}\n\n${reportsBlock}\n\n${deadlinesBlock}`,
      {
        parse_mode: 'HTML',
        reply_markup: organizationKeys({
          includePrimaryButtons: false,
          extraRows: [[{ text: '◀️ Ro‘yxatga qaytish', data: 'listOrganizations' }]],
        }),
      },
    );
  }

  @Action('pendingReports')
  async pendingReports(@Ctx() ctx: ContextType) {
    const reports = await this.reportSubmissionService.getPendingReports();

    if (!reports.length) {
      await ctx.editMessageText('✅ Kutilayotgan hisobotlar yo‘q.', {
        reply_markup: reportsKeys(),
      });
      return;
    }

    const preview = reports.slice(0, 10);
    const content = preview
      .map((report, index) => {
        return `${index + 1}. <b>${report.title}</b>\n   🏢 ${report.organization?.short_name ?? report.organization_id}\n   📅 Yuborilgan: ${this.formatDate(report.submitted_at)}\n   👤 Yuborgan: ${report.submitted_by?.first_name ?? 'Noma’lum'}`;
      })
      .join('\n\n');

    const footer =
      reports.length > preview.length
        ? `\n\n... va yana ${reports.length - preview.length} ta hisobot`
        : '';

    await ctx.editMessageText(
      `<b>Kutilayotgan hisobotlar</b>\n\n${content}${footer}`,
      {
        parse_mode: 'HTML',
        reply_markup: reportsKeys({
          extraRows: this.chunkButtons(
            preview.map((report, index) => ({
              text: `${index + 1}. ${this.truncate(report.title)}`,
              data: `reportDetails:${report.id}`,
            })),
          ),
        }),
      },
    );
  }

  @Action('overdueReports')
  async overdueReports(@Ctx() ctx: ContextType) {
    const reports = await this.reportSubmissionService.getOverdueReports();

    if (!reports.length) {
      await ctx.editMessageText('✅ Kechikkan hisobotlar yo‘q.', {
        reply_markup: reportsKeys(),
      });
      return;
    }

    const preview = reports.slice(0, 10);
    const content = preview
      .map((report, index) => {
        return `${index + 1}. <b>${report.title}</b>\n   🏢 ${report.organization?.short_name ?? report.organization_id}\n   ⏳ Deadline: ${this.formatDate(report.deadline)}\n   👮 Inspektor: ${report.assigned_inspector?.first_name ?? 'Biriktirilmagan'}`;
      })
      .join('\n\n');

    await ctx.editMessageText(`<b>Kechikkan hisobotlar</b>\n\n${content}`, {
      parse_mode: 'HTML',
      reply_markup: reportsKeys({
        extraRows: this.chunkButtons(
          preview.map((report, index) => ({
            text: `${index + 1}. ${this.truncate(report.title)}`,
            data: `reportDetails:${report.id}`,
          })),
        ),
      }),
    });
  }

  @Action(/reportDetails:(.+)/)
  async reportDetails(@Ctx() ctx: ContextType) {
    const reportId = ctx.match?.[1];
    if (!reportId) {
      await ctx.answerCbQuery('Hisobot topilmadi');
      return;
    }

    await this.renderReportDetails(ctx, reportId);
  }

  @Action(/reportAction:(.+)/)
  async reportAction(@Ctx() ctx: ContextType) {
    const [, action, reportId] = ctx.match;
    const userId = ctx.from.id;

    try {
      if (action === 'approve') {
        await this.handleApprove(reportId, userId, ctx);
      } else if (action === 'reject') {
        this.pendingReportActions.set(userId, { reportId, type: 'reject' });
        await this.promptForComment(ctx, 'Rad etish sababini kiriting:');
        await ctx.answerCbQuery('Sababni matn ko‘rinishida yuboring', {
          show_alert: true,
        });
      } else if (action === 'revise') {
        this.pendingReportActions.set(userId, { reportId, type: 'revise' });
        await this.promptForComment(ctx, 'Qayta ishlash izohini kiriting:');
        await ctx.answerCbQuery('Izohni matn ko‘rinishida yuboring', {
          show_alert: true,
        });
      }
    } catch (error) {
      await ctx.answerCbQuery('Amalni bajarib bo‘lmadi', { show_alert: true });
    }
  }

  @On('text')
  async handleTextInput(@Ctx() ctx: ContextType) {
    const pending = this.pendingReportActions.get(ctx.from.id);
    if (!pending) {
      return;
    }

    const comment = ctx.message?.text?.trim();
    if (!comment) {
      await ctx.reply('Matnli izoh yuboring.');
      return;
    }

    this.pendingReportActions.delete(ctx.from.id);
    await this.clearPromptMessage(ctx.from.id, ctx);

    try {
      if (pending.type === 'reject') {
        await this.reportSubmissionService.rejectReport(
          pending.reportId,
          ctx.from.id.toString(),
          comment,
        );
        await ctx.reply('Hisobot rad etildi ❌');
      } else {
        await this.reportSubmissionService.requestRevision(
          pending.reportId,
          ctx.from.id.toString(),
          comment,
        );
        await ctx.reply('Qayta ishlash talabi yuborildi 🔄');
      }

      await this.refreshReportView(pending.reportId, ctx);
    } catch (error) {
      await ctx.reply('Amalni bajarib bo‘lmadi, keyinroq urinib ko‘ring.');
    }
  }

  @Action('upcomingDeadlines')
  async upcomingDeadlines(@Ctx() ctx: ContextType) {
    const deadlines = await this.deadlineService.getUpcoming();

    if (!deadlines.length) {
      await ctx.editMessageText('📅 Yaqin 30 kun ichida deadline yo‘q.', {
        reply_markup: deadlinesKeys(),
      });
      return;
    }

    const preview = deadlines.slice(0, 10);
    const content = preview
      .map((deadline, index) => {
        return `${index + 1}. <b>${deadline.title}</b>\n   🏢 ${deadline.organization?.short_name ?? 'Umumiy'}\n   📅 ${this.formatDate(deadline.due_date)}\n   👤 Mas’ul: ${deadline.assigned_to?.first_name ?? 'Biriktirilmagan'}`;
      })
      .join('\n\n');

    await ctx.editMessageText(`<b>Yaqin deadline’lar</b>\n\n${content}`, {
      parse_mode: 'HTML',
      reply_markup: deadlinesKeys({
        extraRows: this.chunkButtons(
          preview.map((deadline, index) => ({
            text: `${index + 1}. ${this.truncate(deadline.title)}`,
            data: `deadlineDetails:${deadline.id}`,
          })),
        ),
      }),
    });
  }

  @Action('overdueDeadlines')
  async overdueDeadlines(@Ctx() ctx: ContextType) {
    const deadlines = await this.deadlineService.getOverdue();

    if (!deadlines.length) {
      await ctx.editMessageText('✅ Kechikkan deadline yo‘q.', {
        reply_markup: deadlinesKeys(),
      });
      return;
    }

    const preview = deadlines.slice(0, 10);
    const content = preview
      .map((deadline, index) => {
        return `${index + 1}. <b>${deadline.title}</b>\n   🏢 ${deadline.organization?.short_name ?? 'Umumiy'}\n   ⏳ ${this.formatDate(deadline.due_date)}\n   👤 Mas’ul: ${deadline.assigned_to?.first_name ?? 'Biriktirilmagan'}`;
      })
      .join('\n\n');

    await ctx.editMessageText(`<b>Kechikkan deadline’lar</b>\n\n${content}`, {
      parse_mode: 'HTML',
      reply_markup: deadlinesKeys({
        extraRows: this.chunkButtons(
          preview.map((deadline, index) => ({
            text: `${index + 1}. ${this.truncate(deadline.title)}`,
            data: `deadlineDetails:${deadline.id}`,
          })),
        ),
      }),
    });
  }

  @Action(/deadlineDetails:(.+)/)
  async deadlineDetails(@Ctx() ctx: ContextType) {
    const deadlineId = ctx.match?.[1];
    if (!deadlineId) {
      await ctx.answerCbQuery('Deadline topilmadi');
      return;
    }

    await this.renderDeadlineDetails(ctx, deadlineId);
  }

  @Action(/deadlineAction:(.+)/)
  async deadlineAction(@Ctx() ctx: ContextType) {
    const [, action, deadlineId] = ctx.match;
    try {
      if (action === 'complete') {
        await this.deadlineService.complete(deadlineId);
        await ctx.answerCbQuery('Deadline yakunlandi ✅', { show_alert: true });
      } else if (action === 'reopen') {
        await this.deadlineService.reopen(deadlineId);
        await ctx.answerCbQuery('Deadline qayta faollashtirildi 🔄', {
          show_alert: true,
        });
      }
      await this.refreshDeadlineView(deadlineId, ctx);
    } catch (error) {
      await ctx.answerCbQuery('Amalni bajarib bo‘lmadi', { show_alert: true });
    }
  }

  @Action('unreadNotifications')
  async unreadNotifications(@Ctx() ctx: ContextType) {
    const unread = await this.notificationService.getUnread(ctx.from.id.toString());

    if (!unread.length) {
      await ctx.editMessageText('🔔 O‘qilmagan bildirishnomalar yo‘q.', {
        reply_markup: notificationsKeys(),
      });
      return;
    }

    const preview = unread.slice(0, 10);
    const content = preview
      .map((notification, index) => {
        return `${index + 1}. <b>${notification.title}</b>\n   ${notification.message}\n   ⏰ ${this.formatDate(notification.sent_at)}`;
      })
      .join('\n\n');

    const message = `<b>O‘qilmagan bildirishnomalar</b>\n\n${content}`;

    await ctx.editMessageText(message, {
      parse_mode: 'HTML',
      reply_markup: notificationsKeys({
        extraRows: [
          ...this.chunkButtons(
            preview.map((notification, index) => ({
              text: `${index + 1}. ${this.truncate(notification.title)}`,
              data: `notificationDetails:${notification.id}`,
            })),
          ),
          [
            {
              text: '📥 Hammasini o‘qilgan deb belgilash',
              data: 'notificationAction:markAll',
            },
          ],
        ],
      }),
    });
  }

  @Action(/notificationDetails:(.+)/)
  async notificationDetails(@Ctx() ctx: ContextType) {
    const notificationId = ctx.match?.[1];
    if (!notificationId) {
      await ctx.answerCbQuery('Bildirishnoma topilmadi');
      return;
    }

    await this.renderNotificationDetails(ctx, notificationId);
  }

  @Action(/notificationAction:(.+)/)
  async notificationAction(@Ctx() ctx: ContextType) {
    const [, action, id] = ctx.match;
    try {
      if (action === 'mark') {
        await this.notificationService.markAsRead(id);
        await ctx.answerCbQuery('Bildirishnoma o‘qilgan deb belgilandi ✅', {
          show_alert: true,
        });
        await this.refreshNotificationView(id, ctx);
      } else if (action === 'markAll') {
        await this.notificationService.markAllAsRead(ctx.from.id.toString());
        await ctx.answerCbQuery('Barcha bildirishnomalar o‘qilgan deb belgilandi', {
          show_alert: true,
        });
        await this.unreadNotifications(ctx);
      }
    } catch (error) {
      await ctx.answerCbQuery('Amalni bajarib bo‘lmadi', { show_alert: true });
    }
  }

  @Action('backToAdminMenu')
  async backToAdminMenu(@Ctx() ctx: ContextType) {
    await ctx.editMessageText(mainMessageAdmin, { reply_markup: adminMenu });
  }

  private chunkButtons(
    buttons: { text: string; data: string }[],
    perRow = 2,
  ): { text: string; data: string }[][] {
    const rows: { text: string; data: string }[][] = [];
    for (let i = 0; i < buttons.length; i += perRow) {
      rows.push(buttons.slice(i, i + perRow));
    }
    return rows;
  }

  private formatUserName(user?: { first_name?: string; last_name?: string }) {
    if (!user) return '—';
    return `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || '—';
  }

  private truncate(value: string, length = 24) {
    if (!value) return '';
    return value.length > length ? `${value.slice(0, length - 1)}…` : value;
  }

  private composeReportDetailsPayload(
    report: NonNullable<
      Awaited<ReturnType<ReportSubmissionService['getByIdWithRelations']>>
    >,
  ) {
    const statusLabels: Record<string, string> = {
      pending: '⏳ Kutilmoqda',
      under_review: '🔍 Ko‘rib chiqilmoqda',
      approved: '✅ Tasdiqlangan',
      rejected: '❌ Rad etilgan',
      revision_needed: '🔄 Qayta ishlashda',
    };

    const infoBlock = [
      `<b>${report.title}</b> (${report.report_type})`,
      `🏢 ${report.organization?.short_name ?? report.organization_id}`,
      `📊 Status: ${statusLabels[report.status] ?? report.status}`,
      `👤 Yuborgan: ${this.formatUserName(report.submitted_by)}`,
      `📅 Yuborilgan: ${this.formatDate(report.submitted_at)}`,
      `⏳ Deadline: ${this.formatDate(report.deadline)}`,
      `👮 Inspektor: ${this.formatUserName(report.assigned_inspector)}`,
      `👨‍⚖️ Tasdiqlovchi: ${this.formatUserName(report.reviewed_by)}`,
      report.reviewer_comment ? `💬 Reviewer izohi: ${report.reviewer_comment}` : '',
      report.rejection_reason ? `⚠️ Rad etish sababi: ${report.rejection_reason}` : '',
      report.files?.length ? `📎 Fayllar: ${report.files.length} ta` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const history =
      report.history
        ?.slice(0, 5)
        .map(
          (entry) =>
            `• ${this.formatDate(entry.changed_at)} — ${
              entry.action
            } (${this.formatUserName(entry.changed_by)})`,
        )
        .join('\n') ?? '';

    const historyBlock = history
      ? `<b>So‘nggi o‘zgarishlar:</b>\n${history}`
      : '📭 Tarix mavjud emas.';

    return {
      text: `${infoBlock}\n\n${historyBlock}`,
      options: {
        parse_mode: 'HTML' as const,
        reply_markup: reportsKeys({
          includePrimaryButtons: false,
          extraRows: [
            [
              { text: '✅ Tasdiqlash', data: `reportAction:approve:${report.id}` },
              { text: '❌ Rad etish', data: `reportAction:reject:${report.id}` },
            ],
            [
              {
                text: '🔄 Qayta ishlash so‘rash',
                data: `reportAction:revise:${report.id}`,
              },
            ],
            [
              { text: '⬅️ Pending ro‘yxat', data: 'pendingReports' },
              { text: '⚠️ Kechikkanlar', data: 'overdueReports' },
            ],
          ],
        }),
      },
    };
  }

  private async renderReportDetails(
    ctx: ContextType,
    reportId: string,
    targetMessage?: { chatId: number; messageId: number },
  ) {
    const report = await this.reportSubmissionService.getByIdWithRelations(reportId);
    if (!report) {
      if ('answerCbQuery' in ctx) {
        await ctx.answerCbQuery('Hisobot mavjud emas');
      }
      return;
    }

    const payload = this.composeReportDetailsPayload(report);

    if (targetMessage) {
      await ctx.telegram.editMessageText(
        targetMessage.chatId,
        targetMessage.messageId,
        undefined,
        payload.text,
        payload.options,
      );
      this.reportDetailMessages.set(ctx.from.id, targetMessage);
      return;
    }

    if (ctx.callbackQuery?.message) {
      await ctx.editMessageText(payload.text, payload.options);
      this.reportDetailMessages.set(ctx.from.id, {
        chatId: ctx.callbackQuery.message.chat.id,
        messageId: ctx.callbackQuery.message.message_id,
      });
    } else {
      const sent = await ctx.reply(payload.text, payload.options);
      this.reportDetailMessages.set(ctx.from.id, {
        chatId: sent.chat.id,
        messageId: sent.message_id,
      });
    }
  }

  private composeDeadlineDetailsPayload(
    deadline: NonNullable<
      Awaited<ReturnType<DeadlineService['getByIdWithRelations']>>
    >,
  ) {
    const statusLabels: Record<string, string> = {
      pending: '⏳ Kutilmoqda',
      in_progress: '🔄 Jarayonda',
      completed: '✅ Yakunlangan',
      overdue: '⚠️ Kechikkan',
      cancelled: '❌ Bekor qilingan',
    };

    const infoBlock = [
      `<b>${deadline.title}</b> (${deadline.type})`,
      deadline.organization
        ? `🏢 ${deadline.organization.short_name}`
        : '🏢 Umumiy vazifa',
      `📅 Deadline: ${this.formatDate(deadline.due_date)}`,
      `📊 Status: ${statusLabels[deadline.status] ?? deadline.status}`,
      `👤 Mas’ul: ${this.formatUserName(deadline.assigned_to)}`,
      deadline.completed_at
        ? `✅ Yakunlangan: ${this.formatDate(deadline.completed_at)}`
        : '',
      deadline.description ? `📝 ${deadline.description}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const isCompleted = deadline.status === 'completed';

    return {
      text: infoBlock,
      options: {
        parse_mode: 'HTML' as const,
        reply_markup: deadlinesKeys({
          includePrimaryButtons: false,
          extraRows: [
            [
              {
                text: isCompleted ? '🔄 Qayta faollashtirish' : '✅ Yakunlash',
                data: `deadlineAction:${isCompleted ? 'reopen' : 'complete'}:${
                  deadline.id
                }`,
              },
            ],
            [
              { text: '📅 Yaqinlar', data: 'upcomingDeadlines' },
              { text: '⚠️ Kechikkanlar', data: 'overdueDeadlines' },
            ],
          ],
        }),
      },
    };
  }

  private async renderDeadlineDetails(
    ctx: ContextType,
    deadlineId: string,
    targetMessage?: { chatId: number; messageId: number },
  ) {
    const deadline = await this.deadlineService.getByIdWithRelations(deadlineId);
    if (!deadline) {
      if ('answerCbQuery' in ctx) {
        await ctx.answerCbQuery('Deadline mavjud emas');
      }
      return;
    }

    const payload = this.composeDeadlineDetailsPayload(deadline);

    if (targetMessage) {
      await ctx.telegram.editMessageText(
        targetMessage.chatId,
        targetMessage.messageId,
        undefined,
        payload.text,
        payload.options,
      );
      this.deadlineDetailMessages.set(ctx.from.id, targetMessage);
      return;
    }

    if (ctx.callbackQuery?.message) {
      await ctx.editMessageText(payload.text, payload.options);
      this.deadlineDetailMessages.set(ctx.from.id, {
        chatId: ctx.callbackQuery.message.chat.id,
        messageId: ctx.callbackQuery.message.message_id,
      });
    } else {
      const sent = await ctx.reply(payload.text, payload.options);
      this.deadlineDetailMessages.set(ctx.from.id, {
        chatId: sent.chat.id,
        messageId: sent.message_id,
      });
    }
  }

  private async refreshDeadlineView(deadlineId: string, ctx: ContextType) {
    const targetMessage = this.deadlineDetailMessages.get(ctx.from.id);
    await this.renderDeadlineDetails(ctx, deadlineId, targetMessage);
  }

  private async handleApprove(
    reportId: string,
    reviewerId: number,
    ctx: ContextType,
  ) {
    const report = await this.reportSubmissionService.approveReport(
      reportId,
      reviewerId.toString(),
    );
    await ctx.answerCbQuery('Hisobot tasdiqlandi ✅', { show_alert: true });
    await this.refreshReportView(report.id, ctx);
  }

  private async promptForComment(ctx: ContextType, text: string) {
    await this.clearPromptMessage(ctx.from.id, ctx);
    const sent = await ctx.reply(text);
    this.reportPromptMessages.set(ctx.from.id, {
      chatId: sent.chat.id,
      messageId: sent.message_id,
    });
  }

  private async refreshReportView(reportId: string, ctx: ContextType) {
    const targetMessage = this.reportDetailMessages.get(ctx.from.id);
    await this.renderReportDetails(ctx, reportId, targetMessage);
  }

  private async renderNotificationDetails(
    ctx: ContextType,
    notificationId: string,
    targetMessage?: { chatId: number; messageId: number },
  ) {
    const notification = await this.notificationService.getById(notificationId);
    if (!notification) {
      if ('answerCbQuery' in ctx) {
        await ctx.answerCbQuery('Bildirishnoma mavjud emas');
      }
      return;
    }

    const info = [
      `<b>${notification.title}</b>`,
      notification.message,
      `🗂 Kategoriya: ${notification.category}`,
      `🕒 ${this.formatDate(notification.sent_at)}`,
      notification.is_read ? '✅ O‘qilgan' : '🆕 O‘qilmagan',
    ]
      .filter(Boolean)
      .join('\n');

    const inlineKeyboard = notificationsKeys({
      includePrimaryButtons: false,
      extraRows: [
        [
          {
            text: notification.is_read ? '✅ O‘qilgan' : '✅ O‘qildi deb belgilash',
            data: `notificationAction:mark:${notification.id}`,
          },
        ],
        [{ text: '⬅️ Ro‘yxatga qaytish', data: 'unreadNotifications' }],
      ],
    });

    if (targetMessage) {
      await ctx.telegram.editMessageText(
        targetMessage.chatId,
        targetMessage.messageId,
        undefined,
        info,
        { parse_mode: 'HTML', reply_markup: inlineKeyboard },
      );
      this.notificationDetailMessages.set(ctx.from.id, targetMessage);
      return;
    }

    if (ctx.callbackQuery?.message) {
      await ctx.editMessageText(info, {
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard,
      });
      this.notificationDetailMessages.set(ctx.from.id, {
        chatId: ctx.callbackQuery.message.chat.id,
        messageId: ctx.callbackQuery.message.message_id,
      });
    } else {
      const sent = await ctx.reply(info, {
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard,
      });
      this.notificationDetailMessages.set(ctx.from.id, {
        chatId: sent.chat.id,
        messageId: sent.message_id,
      });
    }
  }

  private async refreshNotificationView(
    notificationId: string,
    ctx: ContextType,
  ) {
    const targetMessage = this.notificationDetailMessages.get(ctx.from.id);
    await this.renderNotificationDetails(ctx, notificationId, targetMessage);
  }

  private async clearPromptMessage(userId: number, ctx: ContextType) {
    const prompt = this.reportPromptMessages.get(userId);
    if (!prompt) return;
    await ctx.telegram.deleteMessage(prompt.chatId, prompt.messageId).catch(() => null);
    this.reportPromptMessages.delete(userId);
  }

  private formatDate(value?: Date | string): string {
    if (!value) return '—';
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleString('uz-UZ', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
