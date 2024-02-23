const {CommandInteraction, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const en = require('../Data/Lang/en.json');
const ru = require('../Data/Lang/ru.json');
const uk = require('../Data/Lang/uk.json');
const pl = require('../Data/Lang/pl.json');
const lang = {ru, en, uk, pl};

module.exports = {
    name: 'test',
    description: 'Тестовая команда',
    async execute(message) {
        try {
            const preferredLang = message.guild.preferredLocale;

            // Проверка на доступность языка
            if (!lang.hasOwnProperty(preferredLang)) {
                message.reply(lang.en.test);
                return;
            }

            message.reply(lang[preferredLang].test);
        } catch (error) {
            console.error('Ошибка при использовании команды test:', error);
            console.log('Не удалось обработать запрос.');
        }
    }
}
