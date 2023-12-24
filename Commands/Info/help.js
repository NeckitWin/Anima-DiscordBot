const { SlashCommandBuilder } = require("discord.js");

console.log("command Info/help.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations({ ru: 'помощь', pl: 'pomoc', uk: 'допомога' })
        .setDescription('Shows list of commands')
        .setDescriptionLocalizations({ ru: 'Показывает список команд', pl: 'Pokazuje listę komend', uk: 'Показує список команд' }),
    async execute(interaction) {
        const embed = {
            color: interaction.user.color,
            title: 'List of commands',
            thumbnail: {
                url: interaction.client.user.displayAvatarURL(),
            },
            fields: [
                {
                    name: 'Info',
                    value: '</help:1188221601343357056>, </bot:1188217557883293727> </user:1187805713536405584> </avatar_banner:1188538123521642586>',
                    inline: false,
                },
                {
                    name: 'Moderation',
                    value: '</clear:1188291249225084958>',
                    inline: false,
                },
                {
                    name: 'Utility',
                    value: '</test:1188217557883293730>',
                    inline: false,
                }
            ],
            author: {
                name: `Запрос от ` + interaction.user.displayName,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };
        interaction.reply({ embeds: [embed] });
    },
};