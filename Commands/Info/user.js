const {SlashCommandBuilder} = require("discord.js");

console.log("user.js загружен✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Информация о пользователе'),
    async execute(interaction) {
        await interaction.reply(`Имя пользователя: ${interaction.user.username}\nID: ${interaction.user.id}`);
    }
}