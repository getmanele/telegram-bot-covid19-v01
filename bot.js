require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const markup = require('telegraf/markup');
const COUNTRIES_LIST = require(`./constants`);

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
Привет ${ctx.message.from.first_name}!
Узнай статистику по Коронавирусу.
Введи на англ. название страны и получи статистику.
Посмотреть название всех стран: /help.
`,
    markup
      .keyboard([
        [`Ukraine`, `Russia`],
        [`US`, `Italy`],
        [`Canada`, `Portugal`],
      ])
      .resize()
      .extra()
  )
);
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

// bot.start((ctx) => console.log(ctx));

bot.on('text', async (ctx) => {
  let data = {};

  try {
    data = await api.getReportsByCountries(ctx.message.text);

    const formatData = `
Страна : ${data[0][0].country}
Заболевшие : ${data[0][0].cases}
Смертей : ${data[0][0].deaths}
Вылечились : ${data[0][0].recovered}
  `;
    ctx.reply(formatData);
  } catch {
    ctx.reply(`ошибка: такой страны нет. Смотри /help`);
  }
});

bot.launch();
console.log(`Бот запущен`);
