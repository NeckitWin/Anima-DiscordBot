const {SlashCommandBuilder} = require('discord.js');

console.log("ping.js загружен✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};