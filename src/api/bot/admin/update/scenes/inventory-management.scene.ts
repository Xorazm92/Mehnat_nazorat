import { Scene, SceneEnter, Hears, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { InventoryService } from 'src/core/services/inventory.service';
import { Markup } from 'telegraf';

@Scene('inventory-management')
export class InventoryManagementScene {
  constructor(private inventoryService: InventoryService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('📦 Inventarni ko\'rish', 'view_inventory')],
      [
        Markup.button.callback('➕ Berish', 'issue_item'),
        Markup.button.callback('⬅️ Qaytarish', 'return_item'),
      ],
      [
        Markup.button.callback('❌ Shikastlangan', 'report_damaged'),
        Markup.button.callback('📊 Status', 'inventory_status'),
      ],
      [Markup.button.callback('❌ Chiqish', 'exit')],
    ]);

    await ctx.reply(
      `📦 *Talon va Maxsus Kiyim Boshqaruvi*\n\n` +
      `Amaliyotni tanlang:`,
      {
        reply_markup: keyboard.reply_markup,
        parse_mode: 'Markdown',
      },
    );

    (ctx as any).session['inventory_menu'] = true;
  }

  @Hears('❌ Chiqish')
  async exit(@Ctx() ctx: Context) {
    await (ctx as any).scene.leave();
  }
}
