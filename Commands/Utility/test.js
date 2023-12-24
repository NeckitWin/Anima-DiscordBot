const {SlashCommandBuilder} = require('discord.js');

console.log("command test.js loaded✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command')
        .setNameLocalizations({ru:'тест',pl:'test',uk:'тест'})
        .setDescriptionLocalizations({ru:'Тестовая команда',pl:'Testowa komenda',uk:'Тестова команда'}),
    async execute(interaction) {
        const responses = {
            'ru': 'Тестовая команда работает!',
            'pl': 'Testowa komenda działa!',
            'uk': 'Тестова команда працює!',
            'default': 'Test command works!'
        };

        const locale = interaction.locale || 'default';
        const replyMessage = responses[locale];

        interaction.reply(replyMessage);
    },
}