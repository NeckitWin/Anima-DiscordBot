import en from '../../Data/Lang/en.json' with {type: 'json'};
import ru from '../../Data/Lang/ru.json' with {type: 'json'};
import uk from '../../Data/Lang/uk.json' with {type: 'json'};
import pl from '../../Data/Lang/pl.json' with {type: 'json'};
import {getServer} from "../../Features/dbServer.js";

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

export {getLang, clearLangCache};