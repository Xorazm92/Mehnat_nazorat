import { Scene, SceneEnter, Hears, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PlanService } from 'src/core/services/plan.service';
import { OrganizationService } from 'src/core/services/organization.service';
import { Markup } from 'telegraf';

@Scene('annual-plan-approval')
export class AnnualPlanApprovalScene {
  constructor(
    private planService: PlanService,
    private organizationService: OrganizationService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    const sceneCtx = ctx as any;
    const userId = ctx.from.id.toString();

    // Get organizations where user is responsible
    const responsibilities =
      await this.organizationService.getResponsibilitiesByUser(userId);

    if (responsibilities.length === 0) {
      await ctx.reply('❌ Sizga biriktirilgan tashkilot topilmadi.');
      await sceneCtx.scene.leave();
      return;
    }

    const orgIds = responsibilities.map((r) => r.facility.organization_id);
    const uniqueOrgIds = [...new Set(orgIds)];

    const plans = [];
    for (const orgId of uniqueOrgIds) {
      const orgPlans =
        await this.planService.getAnnualPlansByOrganization(orgId);
      plans.push(...orgPlans);
    }

    if (plans.length === 0) {
      await ctx.reply('❌ Tasdiqlash uchun reja topilmadi.');
      await sceneCtx.scene.leave();
      return;
    }

    // Display plans for approval
    for (const plan of plans) {
      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback('✅ Tasdiqlash', `approve_plan_${plan.id}`),
          Markup.button.callback('❌ Rad etish', `reject_plan_${plan.id}`),
        ],
      ]);

      await ctx.reply(
        `📋 *Yillik Reja Tasdiqlash*\n\n` +
          `Tashkilot: ${plan.organization.name}\n` +
          `Reja turi: ${plan.type}\n` +
          `Yil: ${plan.year}\n` +
          `Tavsif: ${plan.description || "Yo'q"}`,
        {
          reply_markup: keyboard.reply_markup,
          parse_mode: 'Markdown',
        },
      );
    }

    sceneCtx.session['pending_approval'] = plans;
  }

  @Hears('❌ Bekor qilish')
  async cancel(@Ctx() ctx: Context) {
    await (ctx as any).scene.leave();
  }
}
