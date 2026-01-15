require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use((ctx, next) => {
    console.log(`Update keldi: ${ctx.updateType}`);
    console.log('Kimdan:', ctx.from.id);
    console.log('Xabar:', ctx.message?.text);
    return next();
});

bot.start((ctx) => {
    console.log('Start bosildi!');
    ctx.reply('Test muvaffaqiyatli o\'tdi! Bot ishlayapti.');
});

bot.on('message', (ctx) => {
    console.log('Xabar:', ctx.message.text);
    ctx.reply('Siz yozdingiz: ' + ctx.message.text);
});

console.log('Bot polling boshlanmoqda...');
bot.launch()
    .then(() => console.log('Bot ishladi!'))
    .catch((err) => console.error('Botda xatolik:', err));

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
