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
            if (!lang.hasOwnProperty(preferredLang)) preferredLang = 'en';
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
                        value: '</help:1285287069676994605>, </bot:1285287069676994604>, </user:1274053573700878358>, </leaders:1287176496791945268>, </avatar-banner:1285287069676994603>, </server:1285287069676994607>, </role:1285287069676994606>',
                        inline: false,
                    },
                    {
                        name: `👑・${local.admin.label}`,
                        value: '',
                        inline: false,
                    },
                    {
                        name: `👮‍♂️・${local.moder.label}`,
                        value: '</ban:1285287069676994608>, </clear:1285287069676994609>, </mute:1285287069756690486>, </kick:1285287069676994610>',
                        inline: false,
                    },
                    {
                        name: `🔧・${local.util.label}`,
                        value: '</calc:1285287069756690488>, </translate:1285287069756690490>',
                        inline: false,
                    },
                    {
                        name: `🎮・${local.games.label}`,
                        value: '`+aura`, `-aura`',
                        inline: false,
                    },
                    {
                        name: `🎉・${local.fun.label}`,
                        value: '</reaction:1287841310979395676>',
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