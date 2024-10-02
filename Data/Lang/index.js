const en = require('../../Data/Lang/en.json');
const ru = require('../../Data/Lang/ru.json');
const uk = require('../../Data/Lang/uk.json');
const pl = require('../../Data/Lang/pl.json');
const index = {ru, en, uk, pl};

const getLang = (interaction) => {
    let preferredLang = interaction.guild.preferredLocale;
    if (!index.hasOwnProperty(preferredLang)) preferredLang = 'en';
    return index[preferredLang];
}

module.exports = index;