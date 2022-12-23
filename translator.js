const api = require('./api');

api.getLanguages().then((languages) => {
    console.log(languages.data.languages);
});
