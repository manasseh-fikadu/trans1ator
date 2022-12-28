const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const api = require("./api");

const app = express();

const PORT = 3000 || process.env.PORT;

// set up a webhook using 

const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.telegram.setWebhook(
//   `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${process.env.WEBHOOK_URL}`
// );

// app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));

app.post("/system", (req, res) => {
  res.status(200).end();
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   bot.telegram.getWebhookInfo().then((info) => {
//     if (info.url !== `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${process.env.WEBHOOK_URL}`) {
//       bot.telegram.setWebhook(
//         `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${process.env.WEBHOOK_URL}`
//       );
//     } else {
//       console.log("Webhook Set!");
//     }
//   });
// });

bot.launch({
  webhook: {
    domain: process.env.WEBHOOK_URL,
    port: PORT,
  },

  polling: false,
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

bot.command("translate", (ctx) => {

    // prompt the user to enter the source language and the destination language
    ctx.reply(
        "Enter the source language and the destination language in the format: source language - text to be translated - destination language"
    );

    const outerContext = ctx;

    // listen for the user's response
    bot.on((ctx) => {
        // get the user's response
        let userResponse = ctx.message.text;
        // if the user's response is not in the correct format, prompt the user to enter the source language and the destination language again
        if (!userResponse.includes("-")) {
            ctx.reply(
                "Please enter the source language and the destination language in the format: source language - text to be translated - destination language"
            );
            return;
        }
        // remove every whitespace next to and before the hyphen
        userResponse = userResponse.replace(/\s*-\s*/g, "-");

        // split the user's response into an array
        let userResponseArray = userResponse.split("-");

        // get the source language
        let sourceLanguage = userResponseArray[0].toLowerCase();

        // get the text to be translated
        let textToBeTranslated = userResponseArray[1];

        // get the destination language
        let destinationLanguage = userResponseArray[2].toLowerCase();

        // get the language code of the source language
        let sourceLanguageCode = languageCodeMapping[sourceLanguage];

        // get the language code of the destination language
        let destinationLanguageCode = languageCodeMapping[destinationLanguage];

        // call the api and return the response use async await
        api
            .translate(sourceLanguageCode, destinationLanguageCode, textToBeTranslated)
            .then((response) => {
                // return the response for usage in the next then block
                const answer = response.data.translatedText;
                return answer;
            })
            .then((answer) => {
              outerContext.reply(answer);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    });    
  
});


process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
