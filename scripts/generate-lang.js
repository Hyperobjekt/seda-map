if (typeof fetch !== "function") {
    global.fetch = require("node-fetch")
}
const fs = require('fs');
const { csv: fetchCsv } = require("d3-fetch")

// set empty object and set lang doc url
var langJson = {};
const langUrl = 'https://docs.google.com/spreadsheets/d/1L633lO5wfQGLbaVnaSnIg9TrprX9k4Ie8qe_CLDmQN8/export?gid=0&format=csv'

// d3 csv fetcher calls the parser for each row of the fetched csv. add key value pair
// on iteration
const parseLang = (csv) => {
    langJson[csv.key] = csv.value;
}

// write json to en.js
const writeLang = (langJson) => {
    fs.writeFile("./src/modules/explorer/app/constants/en.js", `const LANG = ${JSON.stringify(langJson, null, 2)} \n\nexport default LANG`, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('en.js written!')
    })
};

// fetch csv, parse, write to file, catch errors
fetchCsv(langUrl, parseLang)
.then(() => {
    writeLang(langJson);
})
.catch(err => console.log(err))