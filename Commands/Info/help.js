// Команда help - показывает список команд

const { SlashCommandBuilder } = require("discord.js");

console.log("command Info/help.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations({ ru: 'помощь', pl: 'pomoc', uk: 'допомога' })
        .setDescription('Показывает список команд')
        .setDescriptionLocalizations({ ru: 'Показывает список команд', pl: 'Pokazuje listę komend', uk: 'Показує список команд' }),
    async execute(interaction) {
        const locale = interaction.guild?.preferredLocale || 'default';
        const embed = {
            color: 0x0099ff,
            title: 'List of commands',
            titleLocalizations: { ru: 'Список команд', pl: 'Lista komend', uk: 'Список команд' },
            thumbnail: {
                url: interaction.client.user.displayAvatarURL(),
            },
            fields: [
                {
                    name: 'Info',
                    nameLocalizations: { ru: 'Информация', pl: 'Informacja', uk: 'Інформація' },
                    value: '</help:1188221601343357056>, </bot:1188217557883293727> </user:1187805713536405584> </avatar_banner:1188538123521642586>',
                    inline: false,
                },
                {
                    name: 'Moderation',
                    nameLocalizations: { ru: 'Модерация', pl: 'Moderacja', uk: 'Модерація' },
                    value: '</clear:1188291249225084958>',
                    inline: false,
                },
                {
                    name: 'Utility',
                    nameLocalizations: { ru: 'Полезное', pl: 'Użyteczność', uk: 'Корисне' },
                    value: '</test:1188217557883293730>',
                    inline: false,
                }
            ],
            author: {
                name: `Запрос от ` + interaction.user.displayName,
                nameLocalizations: { ru: 'Запрос от ' + interaction.user.displayName, pl: 'Zapytanie od ' + interaction.user.displayName, uk: 'Запит від ' + interaction.user.displayName },
                icon_url: interaction.user.displayAvatarURL(),
            },
        };
        // Выбираем правильный локализованный заголовок
        embed.title = embed.titleLocalizations?.[locale] || embed.title;

        // Выбираем правильные локализованные имена для полей
        embed.fields.forEach((field) => {
            field.name = field.nameLocalizations?.[locale] || field.name;
        });

        // Выбираем правильное локализованное имя автора
        embed.author.name = embed.author.nameLocalizations?.[locale] || embed.author.name;

        interaction.reply({ embeds: [embed] });
    }
}