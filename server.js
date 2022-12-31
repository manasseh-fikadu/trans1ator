const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const api = require("./api");

const app = express();

const PORT = 3000 || process.env.PORT;

// set up a webhook using

const { Telegraf, Composer, Markup, Scenes, session } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram
  .setWebhook(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}`
  )
  .catch((error) => {
    console.log(error);
  });

app.post("/system", (req, res) => {
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  bot.telegram.getWebhookInfo().then((info) => {
    if (
      info.url ===
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}`
    ) {
      console.log("Webhook Set!");
    } else {
      console.log("Webhook not set!");
    }
  });
});

bot.start((ctx) => {
  ctx.reply(
    "Hi, 🙋‍♂️ Welcome to the language translator bot!" +
      "\n" +
      "\n" +
      "This bot will automatically detect the language of the text you enter and translate it to the language of your choice." +
      "\n" +
      "\n" +
      "Contact @Ambiguous_cosmonaut for any queries." +
      "\n" +
      "\n" +
      "\n" +
      "Type /translate to get started"
  );
});

const languageCodeMapping = {
  english: "en",
  chinese: "zh",
  french: "fr",
  german: "de",
  italian: "it",
  japanese: "ja",
  korean: "ko",
  portuguese: "pt",
  russian: "ru",
  spanish: "es",
  amharic: "am",
  hindi: "hi",
  arabic: "ar",
  turkish: "tr",
  greek: "el",
};

const translateScene = new Scenes.BaseScene("translateScene");
translateScene.enter((ctx) => {
  ctx.reply("Enter the text you want to translate");
});

const translate = new Scenes.BaseScene("translate");

translateScene.on("text", async (ctx) => {
  const inputText = ctx.message.text;
  ctx.session.inputText = inputText;
  const inputLanguage = await api.detect(inputText);
  ctx.session.inputLanguage = inputLanguage;
  // get the language from the detected language code
  const language = Object.keys(languageCodeMapping).find(
    (key) => languageCodeMapping[key] === inputLanguage
  );
  // make a 3 row keyboard with the languages which is also inlined
  const keyboard = Markup.inlineKeyboard(
    // return the inline buttons without using a callback function
    Object.keys(languageCodeMapping).map((key) => {
      return Markup.button.callback(key, key);
    }),
    { columns: 3 }
  );
  ctx.reply(
    `The detected language is ${language}. Select the target language`,
    keyboard
  );
  // listen to the user click on the button
  translateScene.on("callback_query", async (ctx) => {
    // get the target language from the session
    const targetLanguage = ctx.update.callback_query.data;
    // get the target language code
    const targetLanguageCode = languageCodeMapping[targetLanguage];
    ctx.session.targetLanguageCode = targetLanguageCode;
    const translated = await api.translate(
      inputLanguage,
      targetLanguageCode,
      inputText
    );
    const ans = translated.data.translatedText;
    ctx.reply(ans);
    ctx.scene.leave();
  });
});

const stage = new Scenes.Stage([translateScene]);
stage.register(translate);
bot.use(session());
bot.use(stage.middleware());

bot.command("translate", (ctx) => {
  ctx.scene.enter("translateScene");
});

bot.launch({
  polling: false,
});

// graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
