const {Events, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder} = require('discord.js');
const {getLang} = require("../Data/Lang");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isAnySelectMenu() && interaction.customId === 'menuHelp') {
            try {
                const lang = await getLang(interaction);
                const local = lang.menuhelp;
                const localinfo = lang.commandsdesc;

                if (interaction.user.id !== interaction.message.interaction.user.id) return await interaction.reply({
                    content: lang[preferredLang].error.notyourcommand,
                    ephemeral: true
                });

                if (interaction.user.id !== interaction.message.interaction.user.id) {
                    return await interaction.reply({
                        content: lang[preferredLang].error.otheruser,
                        ephemeral: true
                    });
                }

                const infocontent =
                    `</help:1285287069676994605> - ${localinfo.info[0]} \n` +
                    `</bot:1285287069676994604> - ${localinfo.info[1]} \n` +
                    `</user:1274053573700878358> - ${localinfo.info[2]} \n` +
                    `</leaders:1287176496791945268> - ${localinfo.info[3]} \n` +
                    `</avatar-banner:1285287069676994603> - ${localinfo.info[4]} \n` +
                    `</server:1285287069676994607> - ${localinfo.info[5]} \n` +
                    `</role:1285287069676994606> - ${localinfo.info[6]} \n`;

                const admincontent =
                    `</language:1292081237837611079> - ${localinfo.admin[0]} \n` +
                    `</greet set:1309910521654542470> - ${localinfo.admin[4]} \n` +
                    `</greet remove:1309910521654542470> - ${localinfo.admin[5]} \n` +
                    `</logs set:1299470943638519890> - ${localinfo.admin[6]} \n` +
                    `</logs remove:1299470943638519890> - ${localinfo.admin[7]} \n` +
                    `</post:1302340870892163093> - ${localinfo.admin[8]} \n`;

                const modercontent =
                    `</clear:1285287069676994609> - ${localinfo.moder[0]} \n`+
                    `</anti caps:1299470943638519889> - ${localinfo.moder[1]} \n`+
                    `</anti links:1299470943638519889> - ${localinfo.moder[2]}`;

                const economycontent =
                    `</balance:1297200872304021504> - ${localinfo.economy[0]} \n` +
                    `</daily:1313136006362562590> - ${localinfo.economy[1]}`;

                const utilcontent =
                    `</calc:1285287069756690488> - ${localinfo.util[0]} \n` +
                    `</translate:1285287069756690490> - ${localinfo.util[1]} \n` +
                    `</weather:1285287069756690491> - ${localinfo.util[2]} \n` +
                    `</random:1294775882124361819> - ${localinfo.util[3]}\n` +
                    `</anonim-message:1302707978008531125> - ${localinfo.util[4]}`;

                const gamescontent =
                    `</anime:1294302199869997197> - ${localinfo.games[0]} \n` +
                    `</coin_flip:1294379110197624924> - ${localinfo.games[1]} \n` +
                    `\`+aura\` - ${localinfo.games[2]} \n` +
                    `\`-aura\` - ${localinfo.games[3]}`

                const funcontent =
                    `</rp:1299513629934223493> - ${localinfo.fun[0]} \n` +
                    `</marry:1302061890201063454> - ${localinfo.fun[1]} \n` +
                    `</nsfw:1293672483869949973> - ${localinfo.fun[2]} \n` +
                    `</ship:1295137310584864868> - ${localinfo.fun[3]} \n` +
                    `</ben:1292452492986155051> - ${localinfo.fun[4]} \n` +
                    `</ball:1300172412628762656> - ${localinfo.fun[5]}`;

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
                            label: `${local.economy.label}`,
                            description: `${local.economy.description}`,
                            value: 'economy',
                            emoji: '🪙',
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
                let embed = new EmbedBuilder();

                switch (selectedOption) {
                    case 'info':
                        embed.setTitle(`${local.info.description} 📚`)
                            .setDescription(infocontent);
                        break;
                    case 'admin':
                        embed.setTitle(`${local.admin.description} 👑`)
                            .setDescription(admincontent);
                        break;
                    case 'moderation':
                        embed.setTitle(`${local.moder.description} 👮‍♂️`)
                            .setDescription(modercontent);
                        break;
                    case 'economy':
                        embed.setTitle(`${local.economy.description} 🪙`)
                            .setDescription(economycontent);
                        break;
                    case 'utils':
                        embed.setTitle(`${local.util.description} 🔧`)
                            .setDescription(utilcontent);
                        break;
                    case 'games':
                        embed.setTitle(`${local.games.description} 🎮`)
                            .setDescription(gamescontent);
                        break;
                    case 'fun':
                        embed.setTitle(`${local.fun.description} 🎉`)
                            .setDescription(funcontent);
                        break;
                }
                await interaction.update({embeds: [embed], components: [rowForHelpEvent]});
            } catch (error) {
                console.error(error);
            }
        }
    }
}