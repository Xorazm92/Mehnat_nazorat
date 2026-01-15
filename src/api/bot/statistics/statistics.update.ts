import { Injectable } from '@nestjs/common';
import { Ctx, Hears, Update } from 'nestjs-telegraf';
import {
  EMPLOYEE_STATS_KEYBOARD,
  STATISTICS_MENU_KEYBOARD,
} from 'src/common/constants/keyboards';
import { MESSAGES, STATS_MESSAGES } from 'src/common/constants/messages';
import { PeriodType, UserRole } from 'src/common/enum';
import { ContextType } from 'src/common/types';
import { User } from 'src/core/entity/user.entity';
import { UserRepository } from 'src/core/repository/user.repository';
import { StatisticsService } from 'src/core/services/statistics.service';
import { InjectRepository } from '@nestjs/typeorm';

@Update()
@Injectable()
export class StatisticsUpdate {
  constructor(
    private readonly statisticsService: StatisticsService,
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}

  @Hears('📊 Statistika') // Manager Menu
  async statisticsMenu(@Ctx() ctx: ContextType) {
    const user = await this.getUser(ctx);
    if (!user) return ctx.reply(MESSAGES.ERROR);
    if (user.role !== UserRole.MANAGER)
      return ctx.reply(MESSAGES.NO_PERMISSION);
    await ctx.reply(MESSAGES.CHOOSE_ACTION, STATISTICS_MENU_KEYBOARD);
  }

  @Hears('📊 Statistikam') // Employee Menu
  async myStatistics(@Ctx() ctx: ContextType) {
    await ctx.reply(MESSAGES.CHOOSE_ACTION, EMPLOYEE_STATS_KEYBOARD);
  }

  // --- COMMON STATS ---

  @Hears(['📅 Kunlik', '📆 Haftalik', '📈 Oylik'])
  async getStats(@Ctx() ctx: ContextType) {
    const user = await this.getUser(ctx);
    if (!user) return ctx.reply(MESSAGES.ERROR);
    const type = ctx.message.text;
    const now = new Date();

    let stats;
    let messageFunc;

    if (type.includes('Kunlik')) {
      stats = await this.statisticsService.getDailyStatistics(
        user.telegram_id,
        now,
      );
      messageFunc = STATS_MESSAGES.DAILY_STATS;
    } else if (type.includes('Haftalik')) {
      stats = await this.statisticsService.getWeeklyStatistics(
        user.telegram_id,
        now,
      );
      messageFunc = STATS_MESSAGES.WEEKLY_STATS;
    } else {
      stats = await this.statisticsService.getMonthlyStatistics(
        user.telegram_id,
        now.getFullYear(),
        now.getMonth() + 1,
      );
      messageFunc = STATS_MESSAGES.MONTHLY_STATS;
    }

    await ctx.reply(messageFunc(stats));
  }

  @Hears('🏆 Reytinglar')
  async getRankings(@Ctx() ctx: ContextType) {
    const topPerformers = await this.statisticsService.getTopPerformers(
      PeriodType.MONTHLY,
    );
    if (topPerformers.length === 0)
      return ctx.reply("Reyting ma'lumotlari mavjud emas.");
    await ctx.reply(STATS_MESSAGES.TOP_PERFORMERS(topPerformers));
  }

  @Hears(['📈 Oylik natijalar', '🎯 Bajarilish foizi', '🏆 Mening reytingim'])
  async employeeSpecificStats(@Ctx() ctx: ContextType) {
    // Re-use logic or customize for employee view
    // For simplicity, we just trigger the monthly stat logic which is generic
    const now = new Date();
    const user = await this.getUser(ctx);
    if (!user) return ctx.reply(MESSAGES.ERROR);
    const stats = await this.statisticsService.getMonthlyStatistics(
      user.telegram_id,
      now.getFullYear(),
      now.getMonth() + 1,
    );
    await ctx.reply(STATS_MESSAGES.MONTHLY_STATS(stats));
  }

  private async getUser(ctx: ContextType): Promise<User | null> {
    return this.userRepo.findOne({ where: { telegram_id: `${ctx.from.id}` } });
  }
}
