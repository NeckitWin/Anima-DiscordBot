const { SlashCommandBuilder } = require('discord.js');

console.log("clear.js загружен✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Очищает чат')
        .addIntegerOption(option =>
            option.setName('количество')
                .setDescription('Количество сообщений для очистки')
                .setRequired(true)
        ),
    async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.permissions.has('ManageMessages')) {
            return interaction.reply({content:'У вас нет прав на использование этой команды', ephemeral: true});
        }

        const amount = interaction.options.getInteger('количество');

        if (amount <= 0 || amount > 100) {
            return interaction.reply({content:'Укажите число от 1 до 100', ephemeral: true});
        }

        await interaction.reply(`Очищено ${amount} сообщений`);
        },
};
