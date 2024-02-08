const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");

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
        // Создаём кнопочку
        const ButtonServer = new ButtonBuilder()
            .setLabel("Discord Server")
            .setURL("https://discord.com/invite/JxNyZAsYpA")
            .setStyle(ButtonStyle.Link);

        const ButtonWebSite = new ButtonBuilder()
            .setLabel("Website")
            .setURL("https://neckitwin.github.io/")
            .setStyle(ButtonStyle.Link);

        const ButtonGitHub = new ButtonBuilder()
            .setLabel("Source Code")
            .setURL("https://github.com/NeckitWin/Anima-DiscordBot")
            .setStyle(ButtonStyle.Link);

        const rowLinksForHelp = new ActionRowBuilder()
            .addComponents(ButtonServer, ButtonWebSite, ButtonGitHub);

        const embed = {
            color: interaction.user.color,
            title: 'List of commands',
            thumbnail: {
                url: interaction.client.user.displayAvatarURL(),
            },
            fields: [
                {
                    name: 'Информация',
                    value: '</help:1188221601343357056>, </bot:1188217557883293727> </user:1188217557883293728> </avatar_banner:1188538123521642586>, </user:1188217557883293728>, </server:1204559755503468564>',
                    inline: false,
                },
                {
                    name: 'Администрация',
                    value: '</ban:1204559755503468565>',
                    inline: false,
                },
                {
                    name: 'Модерация',
                    value: '</clear:1188291249225084958>, </mute:1204559755503468567>',
                    inline: false,
                },
                {
                    name: 'Утилиты',
                    value: '</ping:1204559755964846100>, </offer:1204559755503468568>',
                    inline: false,
                },
                {
                    name: 'Игры',
                    value: '</russian-roulette:1204801418028912650>',
                    inline: false,
                },
            ],
            author: {
                name: `Запрос от ` + interaction.user.displayName,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };
        interaction.reply({embeds: [embed], components: [rowLinksForHelp]});
    },
};