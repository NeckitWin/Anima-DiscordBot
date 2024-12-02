const en = require('../../Data/Lang/en.json');
const ru = require('../../Data/Lang/ru.json');
const uk = require('../../Data/Lang/uk.json');
const pl = require('../../Data/Lang/pl.json');
const {getServer} = require("../funcs/dbServer");
const index = {ru, en, uk, pl};

const langCache = new Map();

const getLang = async (interaction) => {
    try {
        const {guild, locale} = interaction;
        if (guild) {
            const guildId = guild.id;
            const guildName = guild.name;

            if (langCache.has(guildId)) {
                const cachedLang = langCache.get(guildId);
                return index[cachedLang] || index[`en`];
            }

            const serverData = await getServer(guildId, guildName);
            const lang = serverData.lang;

            langCache.set(guildId, lang);
            return index[lang] || index[`en`];
        } else {
            return index[locale] || index[`en`];
        }
    } catch (error) {
        console.error(error);
        return index[`en`];
    }
}

const clearLangCache = (guildId) => {
    langCache.delete(guildId);
};

module.exports = {getLang, clearLangCache};