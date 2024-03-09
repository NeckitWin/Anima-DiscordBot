const {SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js");
const lang = require('../../Data/Lang');

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
        try {
            let preferredLang = interaction.guild.preferredLocale;
            if (!lang.hasOwnProperty(preferredLang)) {
                preferredLang = 'en';
            }
            let local = lang[preferredLang].menuhelp;
            const menuHelp = new StringSelectMenuBuilder()
                .setCustomId('menuHelp')
                .setPlaceholder(local.placeholder)
                .addOptions([
                    {
                        label: `${local.info.label}`,
                        description: `${local.info.description}`,
                        value: 'info',
                        emoji: '📚',
                    },
                    {
                        label: `${local.admin.label}`,
                        description: `${local.admin.description}`,
                        value: 'admin',
                        emoji: '👑',
                    },
                    {
                        label: `${local.moder.label}`,
                        description: `${local.moder.description}`,
                        value: 'moderation',
                        emoji: '👮‍♂️',
                    },
                    {
                        label: `${local.util.label}`,
                        description: `${local.util.description}`,
                        value: 'utils',
                        emoji: '🔧',
                    },
                    {
                        label: `${local.games.label}`,
                        description: `${local.games.description}`,
                        value: 'games',
                        emoji: '🎮',
                    },
                    {
                        label: `${local.fun.label}`,
                        description: `${local.fun.description}`,
                        value: 'fun',
                        emoji: '🎉',
                    },
                ]);

            const rowForHelp = new ActionRowBuilder()
                .addComponents(menuHelp);

            const embed = {
                color: interaction.user.color,
                title: local.placeholder,
                thumbnail: {
                    url: interaction.client.user.displayAvatarURL(),
                },
                fields: [
                    {
                        name: `📚・${local.info.label}`,
                        value: '</help:1188221601343357056>, </bot:1188217557883293727>, </user:1188217557883293728>, </avatar-banner:1212862481677164635>, </user:1188217557883293728>, </server:1204559755503468564>, </role:1206219274444734569>',
                        inline: false,
                    },
                    {
                        name: `👑・${local.admin.label}`,
                        value: '</technical-problem:1215979169444270113>',
                        inline: false,
                    },
                    {
                        name: `👮‍♂️・${local.moder.label}`,
                        value: '</ban:1204559755503468565>, </clear:1188291249225084958>, </mute:1204559755503468567>, </kick:1204559755503468566>',
                        inline: false,
                    },
                    {
                        name: `🔧・${local.util.label}`,
                        value: '</calc:1206292565553315870>, </offer:1204559755503468568>, </translate:1206292565553315871>, </ping:1204559755964846100>',
                        inline: false,
                    },
                    {
                        name: `🎮・${local.games.label}`,
                        value: '</russian-roulette:1204801418028912650>',
                        inline: false,
                    },
                    {
                        name: `🎉・${local.fun.label}`,
                        value: '</random-anime:1212842667667488790>',
                        inline: false,
                    }
                ],
                author: {
                    name: lang[preferredLang].request + interaction.user.displayName,
                    icon_url: interaction.user.displayAvatarURL(),
                },
            };
            interaction.reply({embeds: [embed], components: [rowForHelp],});
        }catch (err){
            console.error("Error in file help.js: " + err);
        }
    },
};