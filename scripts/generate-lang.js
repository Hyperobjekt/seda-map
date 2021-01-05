if (typeof fetch !== "function") {
    global.fetch = require("node-fetch")
}
const fs = require('fs');
const { csv: fetchCsv } = require("d3-fetch")

var langJson = {};
const lang = 'https://docs.google.com/spreadsheets/d/1L633lO5wfQGLbaVnaSnIg9TrprX9k4Ie8qe_CLDmQN8/export?gid=0&format=csv'

const parseLang = (csv) => {
    langJson[csv.key] = csv.value;
}

const writeLang = (langJson) => {
    fs.writeFile("./src/modules/explorer/app/constants/en.js", `const LANG = ${JSON.stringify(langJson, null, 2)} \n\nexport default LANG`, function(err) {
        if (err) {
            return console.log(err);
        }
    })
};

async function getData(url, parser) {
    return await fetchCsv(url, parser)
}

const getLang = () => getData(lang, parseLang)

getLang().then(() => {
    writeLang(langJson);
})