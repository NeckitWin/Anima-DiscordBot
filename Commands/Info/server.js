const { SlashCommandBuilder } = require("discord.js");

console.log("command Info/mods.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setNameLocalizations({ ru: 'сервер', pl: 'serwer', uk: 'сервер' })
        .setDescription('Shows information about the server')
        .setDescriptionLocalizations({ru: "Показывает информацию о сервере", pl: "Pokazuje informacje o serwerze", uk: "Показує інформацію про сервер"}),
    async execute(interaction) {
        try {
            const guild = interaction.guild;
            const owner = await guild.fetchOwner();
            await guild.channels.fetch();

            const embed = {
                color: 0x0099ff,
                title: `Информация о сервере ${guild.name}`,
                thumbnail: {
                    url: guild.iconURL(),
                },
                fields: [
                    { name: '👑 Владелец сервера', value: "```"+owner.user.username+"```", inline: true },
                    { name: '🆔 ID сервера', value: "```"+guild.id+"```", inline: false },
                    { name: '📅 Дата создания', value: "```"+guild.createdAt.toDateString()+"```", inline: true },
                    { name: '👥 Количество участников', value: "```"+guild.memberCount+"```", inline: true },
                    { name: '📺 Количество каналов', value: "```"+guild.channels.cache.size+"```", inline: true, },
                ],
            };

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('Произошла ошибка при получении информации о сервере.');
        }
    },
};