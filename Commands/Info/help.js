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
                    name: 'Информация',
                    value: '</help:1198654073763790861>, </bot:1198654073763790860> </user:1198654073763790862> </avatar_banner:1198654073763790859>',
                    inline: false,
                },
                {
                    name: 'Администрация',
                    value: '',
                    inline: false,
                },
                {
                    name: 'Модерация',
                    value: '</clear:1198654073763790864>, </mute:1198673150691520694>, </ban:1198661669031776396>',
                    inline: false,
                },
                {
                    name: 'Утилиты',
                    value: '</test:1198654073763790865>',
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