const {Events, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder} = require('discord.js');
const {getLang} = require("../Data/Lang");

module.exports = {
    cooldown: 5,
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isAnySelectMenu() && interaction.customId === 'menuHelp') {

            const lang = await getLang(interaction);
            const local = lang.menuhelp;
            const localinfo = lang.commandsdesc;

            if (interaction.user.id !== interaction.message.interaction.user.id) return await interaction.reply({content: lang[preferredLang].error.notyourcommand, ephemeral: true});

            if (interaction.user.id !== interaction.message.interaction.user.id) {
                return await interaction.reply({
                    content: lang[preferredLang].error.otheruser,
                    ephemeral: true
                });
            }

            const infocontent = `</help:1285287069676994605> - ${localinfo.info[0]} \n` +
                `</bot:1285287069676994604> - ${localinfo.info[1]} \n` +
                `</user:1274053573700878358> - ${localinfo.info[2]} \n` +
                `</leaders:1287176496791945268> - ${localinfo.info[3]} \n` +
                `</avatar-banner:1285287069676994603> - ${localinfo.info[4]} \n` +
                `</server:1285287069676994607> - ${localinfo.info[5]} \n` +
                `</role:1285287069676994606> - ${localinfo.info[6]} \n`;

            const admincontent = `</language:1292081237837611079> - ${localinfo.admin[0]} \n`+
                `</say:1287818587666645003> - ${localinfo.admin[1]} \n` +
                `</autorole add:1290435224072884264> - ${localinfo.admin[2]} \n` +
                `</autorole list:1290435224072884264> - ${localinfo.admin[3]} \n` +
                `</autorole remove:1290435224072884264> - ${localinfo.admin[4]} \n` +
                `</greeting set:1290765643011981323> - ${localinfo.admin[5]} \n` +
                `</greeting remove:1290765643011981323> - ${localinfo.admin[6]}`;

            const modercontent = `</ban:1285287069676994608> - ${localinfo.moder[0]} \n` +
                `</kick:1285287069676994610> - ${localinfo.moder[1]} \n` +
                `</mute:1285287069756690486> - ${localinfo.moder[2]} \n` +
                `</clear:1285287069676994609> - ${localinfo.moder[3]}`;

            const utilcontent = `</calc:1285287069756690488> - ${localinfo.util[0]} \n` +
                `</translate:1285287069756690490> - ${localinfo.util[1]} \n` +
                `</weather:1285287069756690491> - ${localinfo.util[2]}`;

            const gamescontent = `</ben:1292452492986155051> - ${localinfo.games[0]} \n` +
                `\`+aura\` - ${localinfo.games[1]} \n`+
            `\`-aura\` - ${localinfo.games[2]}`;

            const funcontent = `</reaction:1287841310979395676> - ${localinfo.fun[0]} \n` +
                                        `</interaction:1288525650721898669> - ${localinfo.fun[1]}`;

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