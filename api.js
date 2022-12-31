const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

function translate(source, target, text) {
  const encodedParams = new URLSearchParams();
  encodedParams.append("source_language", source);
  encodedParams.append("target_language", target);
  encodedParams.append("text", text);

  const options = {
    method: "POST",
    url: "https://text-translator2.p.rapidapi.com/translate",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
    },
    data: encodedParams,
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}

function getLanguages() {
  const options = {
    method: "GET",
    url: "https://text-translator2.p.rapidapi.com/getLanguages",
    headers: {
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}

function detect(text) {
  const options = {
    method: "POST",
    url: "https://microsoft-translator-text.p.rapidapi.com/Detect",
    params: { "api-version": "3.0" },
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
    },
    data: [{ Text: text }],
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data[0].language;
    })
    .catch(function (error) {
      console.error(error);
    });
}

module.exports = {
  translate,
  getLanguages,
  detect,
};
