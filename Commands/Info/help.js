// Команда help - показывает список команд

const { SlashCommandBuilder } = require("discord.js");

console.log("command Info/help.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Показывает список команд'),
    async execute(interaction) {
        const embed = {
            color: 0x0099ff,
            title: `Список команд`,
            thumbnail: {
                url: interaction.client.user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: 'Информация',
                    value: '</help:1188221601343357056>, </bot:1188217557883293727> </user:1187805713536405584>',
                    inline: false,
                },
                {
                    name: 'Модерация',
                    value: '</clear:1188291249225084958>',
                    inline: false,
                },
                {
                    name: 'Утилиты',
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
    }
}