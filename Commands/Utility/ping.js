const {SlashCommandBuilder} = require('discord.js');

console.log("command Utility/ping.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test command')
        .setNameLocalizations({ru:'пинг',pl:'ping',uk:'пінг'})
        .setDescriptionLocalizations({ru:'Тестовая команда',pl:'Testowa komenda',uk:'Тестова команда'}),
    async execute(interaction) {
        const responses = {
            default: 'Pong! ' + interaction.client.ws.ping + 'ms',
            ru: 'Понг! ' + interaction.client.ws.ping + 'мс',
            pl: 'Pong! ' + interaction.client.ws.ping + 'ms',
            uk: 'Понг! ' + interaction.client.ws.ping + 'мс',
        };

        const locale = interaction.locale && responses.hasOwnProperty(interaction.locale) ? interaction.locale : 'default';
        const replyMessage = responses[locale];

        await interaction.reply(replyMessage);
    },
}