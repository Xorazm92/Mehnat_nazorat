import { Injectable } from '@nestjs/common';
import { Ctx, Hears, Update } from 'nestjs-telegraf';
import {
  EMPLOYEE_SALARY_KEYBOARD,
  SALARY_MENU_KEYBOARD,
} from 'src/common/constants/keyboards';
import { MESSAGES, SALARY_MESSAGES } from 'src/common/constants/messages';
import { UserRole } from 'src/common/enum';
import { ContextType } from 'src/common/types';
import { User } from 'src/core/entity/user.entity';
import { UserRepository } from 'src/core/repository/user.repository';
import { SalaryService } from 'src/core/services/salary.service';
import { InjectRepository } from '@nestjs/typeorm';

@Update()
@Injectable()
export class SalaryUpdate {
  constructor(
    private readonly salaryService: SalaryService,
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) { }

  @Hears('💰 Maosh') // Manager Menu
  async salaryMenu(@Ctx() ctx: ContextType) {
    const user = await this.getUser(ctx);
    if (!user) return ctx.reply(MESSAGES.ERROR);
    if (user.role !== UserRole.MANAGER)
      return ctx.reply(MESSAGES.NO_PERMISSION);
    await ctx.reply(MESSAGES.CHOOSE_ACTION, SALARY_MENU_KEYBOARD);
  }

  @Hears('💰 Maoshim') // Employee Menu
  async mySalary(@Ctx() ctx: ContextType) {
    await ctx.reply(MESSAGES.CHOOSE_ACTION, EMPLOYEE_SALARY_KEYBOARD);
  }

  @Hears('💵 Maosh hisoblash')
  async calculateSalary(@Ctx() ctx: ContextType) {
    await ctx.scene.enter('CalculateSalaryScene');
  }

  @Hears(['💵 Joriy oy', '📜 Maosh tarixi'])
  async getMySalary(@Ctx() ctx: ContextType) {
    const user = await this.getUser(ctx);
    if (!user) return ctx.reply(MESSAGES.ERROR);
    const now = new Date();
    // Use last month or current month depending on business logic. Usually current running month stats.
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    if (
      ctx.message.text.includes('Tarix') ||
      ctx.message.text.includes('tarixi')
    ) {
      const history = await this.salaryService.getSalaryHistory(
        user.telegram_id,
      );
      if (history.length === 0)
        return ctx.reply(SALARY_MESSAGES.NO_SALARY_DATA);

      let msg = '📜 Maosh Tarixi:\n\n';
      history.slice(0, 5).forEach((s) => {
        msg += `${s.month}: ${s.total} so'm\n`;
      });
      await ctx.reply(msg);
    } else {
      // Current Month
      // Note: Salary record might not exist if not calculated yet.
      // We might show potential salary based on current Tasks.
      // For now, let's try to fetch if exists.
      const salary = await this.salaryService.getSalaryByMonth(
        user.telegram_id,
        monthStr,
      );
      if (!salary) return ctx.reply(SALARY_MESSAGES.NO_SALARY_DATA);
      await ctx.reply(SALARY_MESSAGES.SALARY_DETAILS(salary));
    }
  }

  private async getUser(ctx: ContextType): Promise<User | null> {
    return this.userRepo.findOne({ where: { telegram_id: `${ctx.from.id}` } });
  }
}
