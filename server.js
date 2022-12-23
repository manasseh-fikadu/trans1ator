const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const api = require("./api");

const app = express();

const PORT = 3000 || process.env.PORT;

const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.telegram.setWebhook(
  process.env.WEBHOOK_URL + "/bot" + process.env.BOT_TOKEN
);
app.use(bot.webhookCallback("/bot" + process.env.BOT_TOKEN));

app.post("/system", (req, res) => {
  let messageObj = req && req0.message;
  let chatIdSrc = messageObj && messageObjchatid;
  let fromUserNameSrc = messageObj && messageObjfromusername;
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log("Express Server running at: " + PORT);
  bot.telegram.getWebhookInfo().then((info) => {
    if (info.url !== process.env.WEBHOOK_URL + "/bot" + process.env.BOT_TOKEN) {
      bot.telegram.setWebhook(
        process.env.WEBHOOK_URL + "/bot" + process.env.BOT_TOKEN
      );
    } else {
      console.log("Webhook is already set");
    }
  });
});

bot.start((ctx) => {
  ctx.reply(
    "Welcome to the language translator bot!" +
      "\n" +
      "This Bot was made with ❤ by @Ambiguous_cosmonaut" +
      "\n" +
      "Type /help to get started."
  );
});

bot.help((ctx) => {
  ctx.reply(
    "This bot translates text between languages. Type /translate to get started."
  );
});

bot.command("translate", (ctx) => {
  const relevant = [
    "English",
    "Chinese",
    "French",
    "German",
    "Italian",
    "Japanese",
    "Korean",
    "Portuguese",
    "Russian",
    "Spanish",
    "Amharic",
    "Hindi",
    "Arabic",
    "Turkish",
    "Greek",
  ];

  const languageCodeMapping = {
    English: "en",
    Chinese: "zh",
    French: "fr",
    German: "de",
    Italian: "it",
    Japanese: "ja",
    Korean: "ko",
    Portuguese: "pt",
    Russian: "ru",
    Spanish: "es",
    Amharic: "am",
    Hindi: "hi",
    Arabic: "ar",
    Turkish: "tr",
    Greek: "el",
    };

  ctx.reply("Choose the source language", {
    // make the prompt a two column keyboard
    reply_markup: {
      keyboard: [
        relevant.slice(0, 5),
        relevant.slice(5, 10),
        relevant.slice(10, 15),
      ],
      one_time_keyboard: true,
    },
  });
  // copy the all the relevant array values to a new array
  // get the selected button's text
  bot.hears(relevant, (ctx) => {
    // save the source language
    var source = ctx.message.text;
    ctx.reply("Choose the target language", {
      // make the prompt a two column keyboard
      reply_markup: {
        keyboard: [
          relevant.slice(0, 5),
          relevant.slice(5, 10),
          relevant.slice(10, 15),
        ],
        one_time_keyboard: true,
      },
    });
    bot.hears((ctx) => {
      // save the target language
      var target = ctx.message.text;
      console.log("t" + target);
      // get the selected button's text
      ctx.reply("Enter the text to translate");
      // get the text to translate change the deprecated on to onText
      bot.onText(/(.+)/, (ctx) => {
        var text = ctx.message.text;
        // translate the text
        source = languageCodeMapping[source];
        target = languageCodeMapping[target];
        api.translate(text, source, target).then((translation) => {
          ctx.reply(translation.data.translations[0].translatedText);
        });
      });
    });
  });
});

bot.launch();
