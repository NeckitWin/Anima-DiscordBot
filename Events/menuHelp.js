const {Events, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder} = require('discord.js');
const {rowForHelpEx} = require('../Commands/Info/help.js');
const lang = require('../Data/Lang');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isAnySelectMenu() && interaction.customId === 'menuHelp') {

            let preferredLang = interaction.guild.preferredLocale;
            if (!lang.hasOwnProperty(preferredLang)) {
                preferredLang = 'en';
            }
            let local = lang[preferredLang].menuhelp;
            let localinfo = lang[preferredLang].commandsdesc;

            if (interaction.user.id !== interaction.message.interaction.user.id) {
                return await interaction.reply({
                    content: lang[preferredLang].error.otheruser,
                    ephemeral: true
                });
            }

            const infocontent = `</help:1188221601343357056> - ${localinfo.info[0]} \n` +
                `</bot:1188217557883293727> - ${localinfo.info[1]} \n` +
                `</user:1188217557883293728> - ${localinfo.info[2]} \n` +
                `</avatar-banner:1212862481677164635> - ${localinfo.info[3]} \n` +
                `</user:1188217557883293728> - ${localinfo.info[4]} \n` +
                `</server:1204559755503468564> - ${localinfo.info[5]} \n` +
                `</role:1206219274444734569> - ${localinfo.info[6]}`;

            const admincontent = `</technical-problem:1215979169444270113> - ${localinfo.admin[0]} \n`

            const modercontent = `</ban:1204559755503468565> - ${localinfo.moder[0]} \n` +
                `</kick:1204559755503468566> - ${localinfo.moder[1]} \n` +
                `</mute:1204559755503468567> - ${localinfo.moder[2]} \n` +
                `</clear:1188291249225084958> - ${localinfo.moder[3]}`;

            const utilcontent = `</calc:1206292565553315870> - ${localinfo.util[0]} \n` +
                `</offer:1204559755503468568> - ${localinfo.util[1]} \n` +
                `</translate:1206292565553315871> - ${localinfo.util[2]} \n` +
                `</ping:1204559755964846100> - ${localinfo.util[3]}`;

            const gamescontent = `</russian-roulette:1204801418028912650> - ${localinfo.games[0]}`;

            const funcontent = `</random-anime:1212842667667488790> - ${localinfo.fun[0]}`;

            const menuHelpEvent = new StringSelectMenuBuilder()
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

            const rowForHelpEvent = new ActionRowBuilder()
                .addComponents(menuHelpEvent);
            const selectedOption = interaction.values[0];
            let embed;

            switch (selectedOption) {
                case 'info':
                    embed = new EmbedBuilder()
                        .setTitle(`${local.info.description} 📚`)
                        .setDescription(infocontent);
                    break;
                case 'admin':
                    embed = new EmbedBuilder()
                        .setTitle(`${local.admin.description} 👑`)
                        .setDescription(admincontent);
                    break;
                case 'moderation':
                    embed = new EmbedBuilder()
                        .setTitle(`${local.moder.description} 👮‍♂️`)
                        .setDescription(modercontent);
                    break;
                case 'utils':
                    embed = new EmbedBuilder()
                        .setTitle(`${local.util.description} 🔧`)
                        .setDescription(utilcontent);
                    break;
                case 'games':
                    embed = new EmbedBuilder()
                        .setTitle(`${local.games.description} 🎮`)
                        .setDescription(gamescontent);
                    break;
                case 'fun':
                    embed = new EmbedBuilder()
                        .setTitle(`${local.fun.description} 🎉`)
                        .setDescription(funcontent);
                    break;
            }
            await interaction.update({embeds: [embed], components: [rowForHelpEvent]});
        }
    }
}