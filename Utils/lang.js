import en from '../Data/langs/en.json' with {type: 'json'};
import ru from '../Data/langs/ru.json' with {type: 'json'};
import uk from '../Data/langs/uk.json' with {type: 'json'};
import pl from '../Data/langs/pl.json' with {type: 'json'};
import {getServer} from "../Repo/serverRepository.js";

const lang = {ru, en, uk, pl};
const langCache = new Map();

const getLang = async (interaction) => {
    try {
        const {guild, locale} = interaction;
        if (guild) {
            const guildId = guild.id;
            const guildName = guild.name;

            if (langCache.has(guildId)) {
                const cachedLang = langCache.get(guildId);
                return lang[cachedLang] || lang[`en`];
            }

            const serverData = await getServer(guildId, guildName);
            const serverLang = serverData.lang;

            langCache.set(guildId, serverLang);
            return lang[serverLang] || lang[`en`];
        } else {
            return lang[locale] || lang[`en`];
        }
    } catch (error) {
        console.error(error);
        return lang[`en`];
    }
}

const clearLangCache = (guildId) => {
    langCache.delete(guildId);
};

export {getLang, clearLangCache};