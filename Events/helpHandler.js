import {Events, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder} from 'discord.js';
import {getLang} from '../Utils/lang.js';
import {commandLog} from '../Utils/commandLog.js';
import {menuHelp} from "../Components/Menus/helpMenu.js";
import errorLog from "../Utils/errorLog.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isAnySelectMenu() && interaction.customId === 'menuHelp') {
            try {
                if (!await commandLog("menuButtonHandle", interaction, 1)) return;
                const lang = await getLang(interaction);
                const local = lang.menuhelp;
                const localinfo = lang.commandsdesc;

                if (interaction.user.id !== interaction.message.interaction.user.id) return await interaction.reply({
                    content: lang.error.notyourcommand,
                    ephemeral: true
                });

                const commandsDescription = {
                    info:
                        `</help:1285287069676994605> - ${localinfo.info[0]} \n` +
                        `</bot:1285287069676994604> - ${localinfo.info[1]} \n` +
                        `</user:1274053573700878358> - ${localinfo.info[2]} \n` +
                        `</leaders:1287176496791945268> - ${localinfo.info[3]} \n` +
                        `</avatar-banner:1285287069676994603> - ${localinfo.info[4]} \n` +
                        `</server:1285287069676994607> - ${localinfo.info[5]} \n` +
                        `</role:1285287069676994606> - ${localinfo.info[6]} \n`,
                    admin:
                        `</language:1292081237837611079> - ${localinfo.admin[0]} \n` +
                        `</autoroles:1329204198402953417> - ${localinfo.admin[1]} \n` +
                        `</welcome set:1329204198402953419> - ${localinfo.admin[2]} \n` +
                        `</welcome preview:1329204198402953419> - ${localinfo.admin[3]} \n` +
                        `</welcome remove:1329204198402953419> - ${localinfo.admin[4]} \n` +
                        `</logs set:1299470943638519890> - ${localinfo.admin[5]} \n` +
                        `</logs remove:1299470943638519890> - ${localinfo.admin[6]} \n`,
                    moder:
                        `</clear:1285287069676994609> - ${localinfo.moder[0]} \n` +
                        `</post:1302340870892163093> - ${localinfo.moder[1]} \n`,
                    economy:
                        lang.indev,
                    util:
                        `</calc:1285287069756690488> - ${localinfo.util[0]} \n` +
                        `</translate:1285287069756690490> - ${localinfo.util[1]} \n` +
                        `</weather:1285287069756690491> - ${localinfo.util[2]} \n`,
                    games:
                        `</anime:1294302199869997197> - ${localinfo.games[0]} \n` +
                        `\`+aura\` - ${localinfo.games[1]} \n` +
                        `\`-aura\` - ${localinfo.games[2]}`,
                    fun:
                        `</ai-animal:1365688051745165423> - ${localinfo.fun[6]} \n` +
                        `</rp:1299513629934223493> - ${localinfo.fun[0]} \n` +
                        `</marry:1302061890201063454> - ${localinfo.fun[1]} \n` +
                        `</nsfw:1293672483869949973> - ${localinfo.fun[2]} \n` +
                        `</ship:1295137310584864868> - ${localinfo.fun[3]} \n` +
                        `</ben:1292452492986155051> - ${localinfo.fun[4]} \n` +
                        `</ball:1300172412628762656> - ${localinfo.fun[5]}`
                }

                const helpSelectMenu = menuHelp(local);

                const rowForHelpEvent = new ActionRowBuilder()
                    .addComponents(helpSelectMenu);
                const selectedOption = interaction.values[0];
                let embed = new EmbedBuilder();

                switch (selectedOption) {
                    case 'info':
                        embed.setTitle(`${local.info.description} 📚`)
                            .setDescription(commandsDescription.info);
                        break;
                    case 'admin':
                        embed.setTitle(`${local.admin.description} 👑`)
                            .setDescription(commandsDescription.games);
                        break;
                    case 'moder':
                        embed.setTitle(`${local.moder.description} 👮‍♂️`)
                            .setDescription(commandsDescription.moder);
                        break;
                    case 'economy':
                        embed.setTitle(`${local.economy.description} 🪙`)
                            .setDescription(commandsDescription.economy);
                        break;
                    case 'utils':
                        embed.setTitle(`${local.util.description} 🔧`)
                            .setDescription(commandsDescription.util);
                        break;
                    case 'games':
                        embed.setTitle(`${local.games.description} 🎮`)
                            .setDescription(commandsDescription.games);
                        break;
                    case 'fun':
                        embed.setTitle(`${local.fun.description} 🎉`)
                            .setDescription(commandsDescription.fun);
                        break;
                }
                await interaction.update({embeds: [embed], components: [rowForHelpEvent]});
            } catch (err) {
                await errorLog(err);
            }
        }
    }
}