const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js");

console.log("command Info/help.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations({ru: 'помощь', pl: 'pomoc', uk: 'допомога'})
        .setDescription('Shows list of commands')
        .setDescriptionLocalizations({
            ru: 'Показывает список команд',
            pl: 'Pokazuje listę komend',
            uk: 'Показує список команд'
        }),
    async execute(interaction) {
        const menuHelp = new StringSelectMenuBuilder()
            .setCustomId('menuHelp')
            .setPlaceholder('Узнать поподробнее о командах')
            .addOptions([
                {
                    label: 'Информация',
                    description: 'Информационные команды',
                    value: 'info',
                    emoji: '📚',
                },
                {
                    label: 'Администрация',
                    description: 'Команды для администрации',
                    value: 'admin',
                    emoji: '👑',
                },
                {
                    label: 'Модерация',
                    description: 'Команды для модерации',
                    value: 'moderation',
                    emoji: '👮‍♂️',
                },
                {
                    label: 'Утилиты',
                    description: 'Команды для утилит',
                    value: 'utils',
                    emoji: '🔧',
                },
                {
                    label: 'Игры',
                    description: 'Команды для игр',
                    value: 'games',
                    emoji: '🎮',
                },
                {
                    label: 'Веселье',
                    description: 'Веселые команды',
                    value: 'fun',
                    emoji: '🎉',
                },
            ]);

        const rowForHelp = new ActionRowBuilder()
            .addComponents(menuHelp);

        const embed = {
            color: interaction.user.color,
            title: 'Список команд',
            thumbnail: {
                url: interaction.client.user.displayAvatarURL(),
            },
            fields: [
                {
                    name: '📚Информация',
                    value: '</help:1188221601343357056>, </bot:1188217557883293727> </user:1188217557883293728> </avatar_banner:1188538123521642586>, </user:1188217557883293728>, </server:1204559755503468564>, </role:1206219274444734569>',
                    inline: false,
                },
                {
                    name: '👑Администрация',
                    value: '',
                    inline: false,
                },
                {
                    name: '👮‍♂️‍Модерация',
                    value: '</ban:1204559755503468565>, </clear:1188291249225084958>, </mute:1204559755503468567>, </kick:1204559755503468566>',
                    inline: false,
                },
                {
                    name: '🔧Утилиты',
                    value: '</calc:1206292565553315870>, </offer:1204559755503468568>, </translate:1206292565553315871>, </ping:1204559755964846100>',
                    inline: false,
                },
                {
                    name: '🎮Игры',
                    value: '</russian-roulette:1204801418028912650>',
                    inline: false,
                },
                {
                    name: '🎉Веселье',
                    value: '',
                    inline: false,
                }
            ],
            author: {
                name: `Запрос от ` + interaction.user.displayName,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };
                interaction.reply({embeds: [embed], components: [rowForHelp], });
    },
};