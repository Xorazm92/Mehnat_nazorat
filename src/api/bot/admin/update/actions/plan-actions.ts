import { Injectable } from '@nestjs/common';
import { Ctx, Action, Hears, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Markup } from 'telegraf';
import { PlanService } from 'src/core/services/plan.service';
import { ComplianceService } from 'src/core/services/compliance.service';
import { InventoryService } from 'src/core/services/inventory.service';
import { OrganizationService } from 'src/core/services/organization.service';

@Injectable()
export class AdminPlanActions {
  constructor(
    private planService: PlanService,
    private complianceService: ComplianceService,
    private inventoryService: InventoryService,
    private organizationService: OrganizationService,
  ) {}

  @Action('view_this_month')
  async viewThisMonth(@Ctx() ctx: Context) {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      await ctx.answerCbQuery('Oylik rejalar yuklanyapti...');

      // This would fetch monthly plans for the user's facility
      const message =
        `📅 *${month}-oy rejasi (${year})*\n\n` +
        `Rejalangan vazifalar:\n` +
        `1. Xavfsizlik inspeksiyasi - Muddat: ${new Date(year, month, 15).toLocaleDateString('uz-UZ')}\n` +
        `2. Kuz-qish tayyorgarligi - Muddat: ${new Date(year, month, 20).toLocaleDateString('uz-UZ')}\n` +
        `3. Oylik hisobot - Muddat: ${new Date(year, month, 0).toLocaleDateString('uz-UZ')}\n\n` +
        `Bajarilgan: 1/3 (33%)`;

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('⬅️ Orqaga', 'back_to_menu')],
        ]).reply_markup,
      });
    } catch (error) {
      console.error('viewThisMonth xatosi:', error);
      await ctx.answerCbQuery('Xato yuz berdi');
    }
  }

  @Action('approve_plan_*')
  async approvePlan(@Ctx() ctx: Context) {
    try {
      const callbackData = (ctx.callbackQuery as any)?.data || '';
      const planId = callbackData.replace('approve_plan_', '');
      const userId = ctx.from?.id.toString() || '';

      const plan = await this.planService.getAnnualPlanById(planId);
      if (!plan) {
        await ctx.answerCbQuery('Reja topilmadi');
        return;
      }

      await this.planService.approveAnnualPlan(planId, userId);

      await ctx.answerCbQuery('✅ Reja tasdiqlandi');
      await ctx.editMessageText(
        `✅ *Reja tasdiqlandi*\n\n` +
        `Tashkilot: ${plan.organization.name}\n` +
        `Tasdiqlandi: ${new Date().toLocaleDateString('uz-UZ')}`,
        {
          parse_mode: 'Markdown',
        },
      );
    } catch (error) {
      console.error('approvePlan xatosi:', error);
      await ctx.answerCbQuery('Xato yuz berdi');
    }
  }

  @Action('reject_plan_*')
  async rejectPlan(@Ctx() ctx: Context) {
    try {
      const callbackData = (ctx.callbackQuery as any)?.data || '';
      const planId = callbackData.replace('reject_plan_', '');

      const plan = await this.planService.getAnnualPlanById(planId);
      if (!plan) {
        await ctx.answerCbQuery('Reja topilmadi');
        return;
      }

      await this.planService.rejectAnnualPlan(planId);

      await ctx.answerCbQuery('❌ Reja rad etildi');
      await ctx.editMessageText(
        `❌ *Reja rad etildi*\n\n` +
        `Tashkilot: ${plan.organization.name}\n` +
        `Rad etildi: ${new Date().toLocaleDateString('uz-UZ')}`,
        {
          parse_mode: 'Markdown',
        },
      );
    } catch (error) {
      console.error('rejectPlan xatosi:', error);
      await ctx.answerCbQuery('Xato yuz berdi');
    }
  }

  @Action('view_inventory')
  async viewInventory(@Ctx() ctx: Context) {
    try {
      await ctx.answerCbQuery('Inventar yuklanyapti...');

      const inventory = await this.inventoryService.getAllInventory();
      const status = await this.inventoryService.getInventoryStatus();

      const message =
        `📦 *Inventar Holati*\n\n` +
        `Jami: ${status.total_items}\n` +
        `Saqlanib turgan: ${status.in_stock}\n` +
        `Berilgan: ${status.issued_out}\n` +
        `Shikastlangan: ${status.damaged}\n\n` +
        `Eskirayotgan predmetlar: ${status.expiring_soon.length}`;

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('📋 Batafsil', 'inventory_detail')],
          [Markup.button.callback('⬅️ Orqaga', 'back_to_menu')],
        ]).reply_markup,
      });
    } catch (error) {
      console.error('viewInventory xatosi:', error);
      await ctx.answerCbQuery('Xato yuz berdi');
    }
  }

  @Action('analyze_last_month')
  async analyzeLastMonth(@Ctx() ctx: Context) {
    try {
      await ctx.answerCbQuery('Tahlil yuklanyapti...');

      const complianceSummary =
        await this.complianceService.getComplianceSummary();

      const message =
        `📊 *O'tgan Oyning Tahlili*\n\n` +
        `Normativ talablar: ${complianceSummary.total_items}\n` +
        `Bajarilgan: ${complianceSummary.compliant}\n` +
        `Bajarilmagan: ${complianceSummary.non_compliant}\n` +
        `Qisman bajarilgan: ${complianceSummary.partial}\n` +
        `Tekshirilmagan: ${complianceSummary.not_checked}\n\n` +
        `📈 Moslik darajasi: ${complianceSummary.compliance_rate}%`;

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('📄 PDF Chiqarish', 'export_pdf')],
          [Markup.button.callback('⬅️ Orqaga', 'back_to_menu')],
        ]).reply_markup,
      });
    } catch (error) {
      console.error('analyzeLastMonth xatosi:', error);
      await ctx.answerCbQuery('Xato yuz berdi');
    }
  }

  @Action('back_to_menu')
  async backToMenu(@Ctx() ctx: Context) {
    await (ctx as any).scene.enter('monthly-plan-approval');
  }
}
