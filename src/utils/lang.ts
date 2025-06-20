import en from '../../data/langs/en.json' with {type: 'json'};
import ru from '../../data/langs/ru.json' with {type: 'json'};
import uk from '../../data/langs/uk.json' with {type: 'json'};
import pl from '../../data/langs/pl.json' with {type: 'json'};
import {getServer} from "../repo/serverRepository.js";
import {CommandInteraction} from "discord.js";
import {Record} from "openai/core";

type LangCode = 'ru' | 'en' | 'uk' | 'pl';

const lang: Record<LangCode, any> = {ru, en, uk, pl};
const langCache = new Map();

const getLang = async (interaction: CommandInteraction) => {
    try {
        const {guild, locale} = interaction;
        if (guild) {
            const guildId = guild.id;
            const guildName = guild.name;

            if (langCache.has(guildId)) {
                const cachedLang = langCache.get(guildId) as LangCode;
                return lang[cachedLang] || lang[`en`];
            }

            const serverData = await getServer(guildId);
            const serverLang = serverData?.[0]?.lang as LangCode;

            langCache.set(guildId, serverLang);
            return lang[serverLang] || lang[`en`];
        } else {
            return lang[locale as LangCode] || lang[`en`];
        }
    } catch (error) {
        console.error(error);
        return lang[`en`];
    }
}

const clearLangCache = (guildId: string) => {
    langCache.delete(guildId);
};

export {getLang, clearLangCache};