const {CommandInteraction, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const { greetings } = require('../Data/greetings.json');

module.exports = {
    name: 'test',
    description: 'Тестовая команда',
    async execute(message) {
        try {
            message.reply('Тестовая команда');
        }catch (error) {
            console.error('Ошибка при использовании команды test:', error);
            console.log('Не удалось обработать запрос.');
        }
    }
}