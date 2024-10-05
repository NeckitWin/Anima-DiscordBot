const {SlashCommandBuilder} = require("discord.js");
const {formatDate} = require("../../Data/utility");
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setNameLocalizations({ru: 'сервер', pl: 'serwer', uk: 'сервер'})
        .setDescription('Shows information about the server')
        .setDescriptionLocalizations({
            ru: "Показывает информацию о сервере",
            pl: "Pokazuje informacje o serwerze",
            uk: "Показує інформацію про сервер"
        }),
    async execute(interaction) {
        const lang = await getLang(interaction);
        const local = lang.server;

        const guild = interaction.guild;
        const owner = await guild.fetchOwner();
        await guild.channels.fetch();

        const embed = {
            color: 0x0099ff,
            title: `${local.title} ${guild.name}`,
            thumbnail: {
                url: guild.iconURL(),
            },
            fields: [
                {name: `👑 ${local.owner}`, value: `\`\`\`fix\n${owner.user.username}\`\`\``, inline: true},
                {name: `🆔 ${local.serverid}`, value: `\`\`\`${guild.id}\`\`\``, inline: false},
                {name: `📅 ${local.date}`, value: `\`\`\`${formatDate(guild.createdAt)}\`\`\``, inline: true},
                {name: `👥 ${local.members}`, value: `\`\`\`${guild.memberCount}\`\`\``, inline: true},
                {name: `📺 ${local.channels}`, value: `\`\`\`${guild.channels.cache.size}\`\`\``, inline: true,},
            ],
        };

        await interaction.reply({embeds: [embed]});
    },
};