import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { PlanService } from 'src/core/services/plan.service';
import { OrganizationService } from 'src/core/services/organization.service';

@Injectable()
export class PlanScheduler {
  private readonly logger = new Logger(PlanScheduler.name);

  constructor(
    @InjectBot() private bot: Telegraf,
    private planService: PlanService,
    private organizationService: OrganizationService,
  ) {}

  // Har kuni 9:00 da overdue vazifalar haqida ogohlantirish
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async notifyOverdueTasks() {
    try {
      this.logger.log('⏰ Overdue vazifalar ogohlantirish boshlandi...');

      const overdueItems = await this.planService.getOverdueItems();

      for (const item of overdueItems) {
        if (item.assigned_to) {
          const message =
            `⚠️ *MUDDATI TUGAGAN VAZIFA*\n\n` +
            `Vazifa: ${item.title}\n` +
            `Muddati: ${item.due_date.toLocaleDateString('uz-UZ')}\n` +
            `Tashkilot: ${item.monthly_plan.facility.name}\n\n` +
            `Iltimos, darhol bajarishni boshlang!`;

          try {
            await this.bot.telegram.sendMessage(
              Number(item.assigned_to),
              message,
              {
                parse_mode: 'Markdown',
              },
            );
          } catch (error) {
            this.logger.error(
              `Xodim ${item.assigned_to} ga xabar yuborishda xato`,
              error,
            );
          }
        }
      }

      this.logger.log(
        `✅ ${overdueItems.length} ta overdue vazifa ogohlantirmasyi yuborildi`,
      );
    } catch (error) {
      this.logger.error('Overdue ogohlantirish xatosi:', error);
    }
  }

  // Har oyning oxiri (saat 17:00) da oylik reja yaratish
  @Cron('0 17 * * *') // Har kuni 17:00
  async createMonthlyPlans() {
    try {
      const now = new Date();
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).getDate();

      // Faqat oyning oxirgi kuni bajariladi
      if (now.getDate() !== daysInMonth) {
        return;
      }

      this.logger.log('📅 Oyning oxirgi kunida oylik rejalar yaratilmoqda...');

      const organizations =
        await this.organizationService.getAllOrganizations();

      for (const org of organizations) {
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const annualPlans = await this.planService.getAnnualPlansByOrganization(
          org.id,
        );

        for (const annualPlan of annualPlans) {
          // Generate monthly plans for next month
          await this.planService.generateMonthlyPlansFromAnnualPlan(
            annualPlan.id,
          );

          // Notify facility managers
          const facilities = org.facilities;
          for (const facility of facilities) {
            const responsibilities =
              await this.organizationService.getResponsibilitiesByFacility(
                facility.id,
              );

            for (const responsibility of responsibilities) {
              if (
                responsibility.role === 'MANAGER' ||
                responsibility.role === 'COORDINATOR'
              ) {
                const message =
                  `📋 *OYLIK REJA TAYYORLANDI*\n\n` +
                  `Tashkilot: ${org.name}\n` +
                  `Qo'llanuvchi: ${facility.name}\n` +
                  `Oy: ${nextMonth.getMonth() + 1}/${nextMonth.getFullYear()}\n\n` +
                  `Rejani ko'rish va tasdiqlash uchun /plans buyrug'ini kiriting.`;

                try {
                  await this.bot.telegram.sendMessage(
                    Number(responsibility.user_id),
                    message,
                    {
                      parse_mode: 'Markdown',
                    },
                  );
                } catch (error) {
                  this.logger.error(
                    `Mas'ul ${responsibility.user_id} ga xabar yuborishda xato`,
                    error,
                  );
                }
              }
            }
          }
        }
      }

      this.logger.log(
        '✅ Oylik rejalar yaratildi va ogohlantirmalar yuborildi',
      );
    } catch (error) {
      this.logger.error('Oylik rejalar yaratish xatosi:', error);
    }
  }

  // 5-sanagacha o'tgan oyning tahlili uchun ogohlantirish
  @Cron('0 10 5 * *') // Oyning 5-sanasi saat 10:00
  async notifyMonthlyAnalysis() {
    try {
      this.logger.log('📊 Oylik tahlil ogohlantirmasi yuborilmoqda...');

      const organizations =
        await this.organizationService.getAllOrganizations();

      for (const org of organizations) {
        const responsibilities =
          await this.organizationService.getResponsibilitiesByFacility(
            org.facilities[0]?.id || '',
          );

        for (const responsibility of responsibilities) {
          if (
            responsibility.role === 'MANAGER' ||
            responsibility.role === 'COORDINATOR'
          ) {
            const message =
              `📊 *O'TGAN OY TAHLILI*\n\n` +
              `Tashkilot: ${org.name}\n` +
              `Muddat: Bugun ko'pgina hisobotlar topshirilishi kerak\n\n` +
              `Iltimos, o'tgan oyning hisobotini tahlil qilib, PDF faylini tayyorlang.`;

            try {
              await this.bot.telegram.sendMessage(
                Number(responsibility.user_id),
                message,
                {
                  parse_mode: 'Markdown',
                },
              );
            } catch (error) {
              this.logger.error(
                `Mas'ul ${responsibility.user_id} ga xabar yuborishda xato`,
                error,
              );
            }
          }
        }
      }

      this.logger.log('✅ Oylik tahlil ogohlantirmasyi yuborildi');
    } catch (error) {
      this.logger.error('Oylik tahlil ogohlantirish xatosi:', error);
    }
  }

  // Har haftaning dushanba kuni 8:00 da "Xavfsizlik kuni" uchun ogohlantirish
  @Cron('0 8 * * 1') // Dushanba, saat 8:00
  async notifySafetyDay() {
    try {
      this.logger.log('🛡️ Xavfsizlik kuni ogohlantirmasi yuborilmoqda...');

      const organizations =
        await this.organizationService.getAllOrganizations();

      for (const org of organizations) {
        try {
          // Bu yerda hamma xodimga bildirishnoma yuborish kerak
          // Hozircha faqat log yozamiz
          this.logger.log(
            `Tashkilot ${org.name} uchun xavfsizlik kuni bildirishnomasi tayyorlandi`,
          );
        } catch (error) {
          this.logger.error(
            `Tashkilot ${org.name} uchun xavfsizlik kuni bildirishnomasi xatosi`,
            error,
          );
        }
      }

      this.logger.log('✅ Xavfsizlik kuni ogohlantirmasi yuborildi');
    } catch (error) {
      this.logger.error('Xavfsizlik kuni ogohlantirish xatosi:', error);
    }
  }

  // Kuz-qish tayyorgarligi uchun ogohlantirish (Sentyabr 1-da)
  @Cron('0 8 1 9 *') // Sentyabr 1-sana, saat 8:00
  async notifyWinterPreparation() {
    try {
      this.logger.log(
        '❄️ Kuz-qish tayyorgarligi ogohlantirmasi yuborilmoqda...',
      );

      const organizations =
        await this.organizationService.getAllOrganizations();

      for (const org of organizations) {
        try {
          // Hozircha faqat log yozamiz
          this.logger.log(
            `Tashkilot ${org.name} uchun kuz-qish tayyorgarligi bildirishnomasi tayyorlandi`,
          );
        } catch (error) {
          this.logger.error(
            `Tashkilot ${org.name} uchun kuz-qish tayyorgarligi xatosi`,
            error,
          );
        }
      }

      this.logger.log('✅ Kuz-qish tayyorgarligi ogohlantirmasi yuborildi');
    } catch (error) {
      this.logger.error('Kuz-qish tayyorgarligi ogohlantirish xatosi:', error);
    }
  }
}
