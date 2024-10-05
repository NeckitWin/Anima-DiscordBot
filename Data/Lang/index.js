const en = require('../../Data/Lang/en.json');
const ru = require('../../Data/Lang/ru.json');
const uk = require('../../Data/Lang/uk.json');
const pl = require('../../Data/Lang/pl.json');
const fs = require("node:fs");
const path = require("node:path");
const index = {ru, en, uk, pl};

const getLang = async (interaction) => {
    try {
        const pathFile = path.join(__dirname, `../jsons/lang.json`);
        const jsonData = await fs.promises.readFile(pathFile, 'utf8');
        const data = JSON.parse(jsonData);
        const thisServer = data.find(el => el.serverid === interaction.guild.id);
        if (thisServer) {
            return index[thisServer.lang];
        } else {
            let preferredLang = interaction.guild.preferredLocale;
            if (!index.hasOwnProperty(preferredLang)) preferredLang = 'en';
            return index[preferredLang];
        }
    } catch (error) {
        console.error(error);
        return index[`en`];
    }

}

module.exports = {getLang};