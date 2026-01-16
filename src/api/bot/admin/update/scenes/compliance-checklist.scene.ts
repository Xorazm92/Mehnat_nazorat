import { Scene, SceneEnter, Hears, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PlanService } from 'src/core/services/plan.service';
import { ComplianceService } from 'src/core/services/compliance.service';
import { Markup } from 'telegraf';

@Scene('compliance-checklist')
export class ComplianceChecklistScene {
  constructor(
    private planService: PlanService,
    private complianceService: ComplianceService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    // Get plan items assigned to this user
    // This would typically fetch from monthly plans assigned to user
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("📋 Reja ko'rish", 'view_monthly_plans')],
      [
        Markup.button.callback(
          '✅ Compliance bajarildi',
          'mark_compliance_done',
        ),
      ],
      [Markup.button.callback('❌ Bekor qilish', 'cancel')],
    ]);

    await ctx.reply(
      `📝 *Normativ Talablar Checklist*\n\n` +
        `Siz tayinlangan vazifalarni bajarishni boshlaylik.`,
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
