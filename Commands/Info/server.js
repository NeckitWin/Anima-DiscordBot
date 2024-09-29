const { SlashCommandBuilder } = require("discord.js");
const {formatDate} = require("../../Data/utility");

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
                title: `Info about server ${guild.name}`,
                thumbnail: {
                    url: guild.iconURL(),
                },
                fields: [
                    { name: '👑 Server owner', value: "```"+owner.user.username+"```", inline: true },
                    { name: '🆔 Server ID', value: "```"+guild.id+"```", inline: false },
                    { name: '📅 Date of creation', value: "```"+formatDate(guild.createdAt)+"```", inline: true },
                    { name: '👥 Member count', value: "```"+guild.memberCount+"```", inline: true },
                    { name: '📺 Channels count', value: "```"+guild.channels.cache.size+"```", inline: true, },
                ],
            };

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    },
};