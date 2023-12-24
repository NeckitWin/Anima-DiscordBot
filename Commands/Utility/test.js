const {SlashCommandBuilder} = require('discord.js');

console.log("test.js загружен✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command')
        .setNameLocalizations({ru:'тест',pl:'test'})
        .setDescriptionLocalizations({ru:'Тестовая команда',pl:'Testowa komenda'}),
    async execute(interaction) {
        await interaction.reply({content: "Test command",ru:"Тестик" , ephemeral: true});
    },
}