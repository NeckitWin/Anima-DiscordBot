const {CommandInteraction, AttachmentBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');
const lang = require('../Data/Lang');

module.exports = {
    name: 'test',
    description: 'Тest command',
    async execute(message) {
        try {
            if (!message.channel.permissionsFor(message.client.user).has("SendMessages")) return;
            if(!message.channel.permissionsFor(message.client.user).has("ReadMessageHistory", "SendMessages")) return;
            let preferredLang = message.guild.preferredLocale;
            if (!lang.hasOwnProperty(preferredLang)) {
                preferredLang = 'en';
            }
            message.reply(lang[preferredLang].test);
        } catch (error) {
            console.error('Ошибка при использовании команды test:', error);
            console.log('Не удалось обработать запрос.');
        }
    }
}
