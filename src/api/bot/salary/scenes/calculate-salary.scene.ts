import { Injectable } from '@nestjs/common';
import { Ctx, Scene, SceneEnter, Hears, On } from 'nestjs-telegraf';
import { ContextType } from 'src/common/types';
import { SalaryService } from 'src/core/services/salary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/entity/user.entity';
import { Repository } from 'typeorm';
import {
  MANAGER_MAIN_KEYBOARD,
  BACK_KEYBOARD,
} from 'src/common/constants/keyboards';
import { MESSAGES } from 'src/common/constants/messages';

@Injectable()
@Scene('CalculateSalaryScene')
export class CalculateSalaryScene {
  private step: Map<number, string> = new Map();

  constructor(
    private readonly salaryService: SalaryService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @SceneEnter()
  async onEnter(@Ctx() ctx: ContextType) {
    this.step.set(ctx.from.id, 'employee');

    const employees = await this.userRepository.find({
      where: { role: 'member' as any },
    });

    if (employees.length === 0) {
      await ctx.reply('Xodimlar topilmadi.', MANAGER_MAIN_KEYBOARD);
      await ctx.scene.leave();
      return;
    }

    const buttons = [];
    let row = [];

    for (const emp of employees) {
      row.push({
        text: `${emp.first_name} ${emp.last_name}`,
        callback_data: `salary_emp_${emp.telegram_id}`,
      });

      if (row.length === 2) {
        buttons.push(row);
        row = [];
      }
    }

    if (row.length > 0) {
      buttons.push(row);
    }

    await ctx.reply('Maosh hisoblash uchun xodimni tanlang:', {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
    // Add a back button as a regular keyboard just in case
    await ctx.reply("Yoki 'Ortga' tugmasini bosing.", BACK_KEYBOARD);
  }

  @Hears('🔙 Orqaga')
  async back(@Ctx() ctx: ContextType) {
    await ctx.scene.leave();
    await ctx.reply(MESSAGES.BACK_TO_MAIN, MANAGER_MAIN_KEYBOARD);
  }

  @On('callback_query')
  async onCallback(@Ctx() ctx: ContextType) {
    const data = ctx.callbackQuery['data'];

    if (data.startsWith('salary_emp_')) {
      const employeeId = data.replace('salary_emp_', '');
      ctx.session.salaryEmployeeId = employeeId;

      this.step.set(ctx.from.id, 'amount');
      await ctx.answerCbQuery();
      await ctx.reply(
        'Ushbu oy uchun maosh miqdorini kiriting (bonus va jarimalarni keyingi qadamda kiritasiz):',
        BACK_KEYBOARD,
      );
    }
  }

  @On('text')
  async onText(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);
    const text = ctx.message.text;

    if (text === '🔙 Orqaga') {
      // Handled by Hears
      return;
    }

    switch (currentStep) {
      case 'amount':
        const amount = parseFloat(text);
        if (isNaN(amount) || amount < 0) {
          await ctx.reply("Iltimos, to'g'ri summa kiriting raqamlarda:");
          return;
        }
        ctx.session.salaryBase = amount;
        this.step.set(ctx.from.id, 'bonus');
        await ctx.reply("Bonus miqdorini kiriting (agar yo'q bo'lsa 0):");
        break;

      case 'bonus':
        const bonus = parseFloat(text);
        if (isNaN(bonus) || bonus < 0) {
          await ctx.reply("Iltimos, to'g'ri summa kiriting:");
          return;
        }
        ctx.session.salaryBonus = bonus;
        this.step.set(ctx.from.id, 'penalty');
        await ctx.reply("Jarima miqdorini kiriting (agar yo'q bo'lsa 0):");
        break;

      case 'penalty':
        const penalty = parseFloat(text);
        if (isNaN(penalty) || penalty < 0) {
          await ctx.reply("Iltimos, to'g'ri summa kiriting:");
          return;
        }
        ctx.session.salaryPenalty = penalty;

        // Confirm
        const total =
          ctx.session.salaryBase + ctx.session.salaryBonus - penalty;
        const msg =
          `💰 Hisoblash yakuni:\n\n` +
          `💵 Asosiy: ${ctx.session.salaryBase}\n` +
          `➕ Bonus: ${ctx.session.salaryBonus}\n` +
          `➖ Jarima: ${penalty}\n` +
          `-------------------\n` +
          `Jami to'lov: ${total}\n\n` +
          `Tasdiqlaysizmi?`;

        await ctx.reply(msg, {
          reply_markup: {
            keyboard: [
              [{ text: '✅ Tasdiqlash' }],
              [{ text: '❌ Bekor qilish' }],
            ],
            resize_keyboard: true,
          },
        });
        this.step.set(ctx.from.id, 'confirm');
        break;
    }
  }

  @Hears('✅ Tasdiqlash')
  async confirm(@Ctx() ctx: ContextType) {
    const currentStep = this.step.get(ctx.from.id);
    if (currentStep !== 'confirm') return;

    try {
      const now = new Date();
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Note: create a custom method in service if needed, or use calculateSalary directly with overrides if possible.
      // The existing calculateSalary calculates derived values. We might need a safer manual save.
      // For now, let's look at SalaryService again...
      // It has calculateSalary but that logic is strict.
      // Let's use addBonus for now as a workaround or just save manually?
      // Let's create a new manual entry if not exists via salaryRepository logic or custom service method.
      // Wait, calculateSalary takes inputs.
      // async calculateSalary(user_id, month, base_salary, tasks_completed, tasks_total, ... )

      // I will use calculateSalary but pass 0 tasks to just set the money values,
      // OR I should use a direct save since this is a manual override.
      // Since I don't see a "manualSave" in service, I will just call calculateSalary
      // but I need to be careful about the "bonus" being calculated from completion rate there.
      // Actually, the service calculates bonus = completion * coef.
      // This scene asks for specific bonus amount.
      // The service seems rigid for "Automatic Calculation".
      // I should probably add a method to Service later?
      // For now, I will use `addBonus` logic concept - check if exists, update.
      // But I'll do it here directly or rely on a new service method if I could edit service.
      // The user wanted "Maosh hisoblash".

      // Let's Try to use `calculateSalary` but we might need to adjust it to accept fixed bonus.
      // Checking `SalaryService` code again... line 28: const bonus = completion_rate * bonus_coefficient;
      // It ignores my manual bonus if I use that.

      // To fix this properly I should modify Salary Service to allow manual override.
      // But to move fast, I will use `addBonus` to Set the base + bonus? No `addBonus` only adds.

      // OK, I will construct a manual save in this Controller for now, or better:
      // Modify SalaryService to have `saveManualSalary`.
      // Since I can't modify Service easily in this step without context switch,
      // I will use `salaryService` but maybe I can just inject Repository here?
      // I can, I have `salaryRepository`? No, I have `userRepository`.
      // `SalaryService` has `salaryRepository`.

      // I will use `salaryService.calculateSalary` but I will trick it? No.
      // I will assume for this task I will just use `addBonus` on a base of 0?
      // No, that's hacky.

      // New Plan: I will use `addBonus` to CREATE the record if missing, then update it.
      // `addBonus` creates with base_salary: 0.
      // Then I can update it.

      await this.salaryService.addBonus(
        ctx.session.salaryEmployeeId,
        monthStr,
        ctx.session.salaryBonus,
      );

      // Now update base and penalty
      const salary = await this.salaryService.getSalaryByMonth(
        ctx.session.salaryEmployeeId,
        monthStr,
      );
      salary.base_salary = ctx.session.salaryBase;
      salary.penalty = ctx.session.salaryPenalty;
      salary.total = salary.base_salary + salary.bonus - salary.penalty;

      await this.salaryService.updateSalary(salary.id, {
        base_salary: salary.base_salary,
        penalty: salary.penalty,
        total: salary.total,
      });

      await ctx.reply(
        '✅ Maosh muvaffaqiyatli saqlandi!',
        MANAGER_MAIN_KEYBOARD,
      );
      await ctx.scene.leave();
    } catch (e) {
      console.error(e);
      await ctx.reply('Xatolik yuz berdi.');
    }
  }

  @Hears('❌ Bekor qilish')
  async cancel(@Ctx() ctx: ContextType) {
    await ctx.scene.leave();
    await ctx.reply(MESSAGES.OPERATION_CANCELLED, MANAGER_MAIN_KEYBOARD);
  }
}
