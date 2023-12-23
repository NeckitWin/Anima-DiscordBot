const {SlashCommandBuilder} = require('discord.js');

console.log("test.js загружен✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Тестовая команда'),
    async execute(interaction) {
        await interaction.reply('Тестовая команда');
    },
}