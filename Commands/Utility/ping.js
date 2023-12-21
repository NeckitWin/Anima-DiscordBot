const {SlashCommandBuilder} = require('discord.js');

console.log("ping.js загружен✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Проверка задержки бота'),
    async execute(interaction) {
        await interaction.reply(`Задержка: ${interaction.client.ws.ping} мс`);
    },
};