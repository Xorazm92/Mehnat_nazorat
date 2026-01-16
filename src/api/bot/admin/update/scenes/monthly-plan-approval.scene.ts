import { Scene, SceneEnter, Hears, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PlanService } from 'src/core/services/plan.service';
import { Markup } from 'telegraf';

@Scene('monthly-plan-approval')
export class MonthlyPlanApprovalScene {
  constructor(private planService: PlanService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    // Get current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "📋 Bugun oyning rejasini ko'rish",
          'view_this_month',
        ),
        Markup.button.callback("📅 Barcha rejalarni ko'rish", 'view_all_plans'),
      ],
      [
        Markup.button.callback(
          '✅ Oyning rejasini tasdiqlash',
          'approve_month',
        ),
        Markup.button.callback("📝 O'tgan oy tahlili", 'analyze_last_month'),
      ],
      [Markup.button.callback('❌ Bekor qilish', 'cancel')],
    ]);

    await ctx.reply(
      `📊 *Oylik Reja Boshqaruvi*\n\n` +
        `Joriy oy: ${month}/${year}\n` +
        `Amaliyotni tanlang:`,
      {
        reply_markup: keyboard.reply_markup,
        parse_mode: 'Markdown',
      },
    );
  }

  @Hears('❌ Bekor qilish')
  async cancel(@Ctx() ctx: Context) {
    await (ctx as any).scene.leave();
  }
}
