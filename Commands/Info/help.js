const {SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js");
const {getLang} = require("../../Data/Lang");
const commandName = 'help';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setNameLocalizations({ru: 'помощь', pl: 'pomoc', uk: 'допомога'})
        .setDescription('Shows list of commands')
        .setDescriptionLocalizations({
            ru: 'Показывает список команд',
            pl: 'Pokazuje listę komend',
            uk: 'Показує список команд'
        }),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const local = lang.menuhelp;

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
                        label: local.economy.label,
                        description: local.economy.description,
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
                        inline: false
                    },
                    {
                        name: `👑・${local.admin.label}`,
                        value: `</language:1292081237837611079>, </greet set:1309910521654542470>, </greet remove:1309910521654542470>, </logs set:1299470943638519890>, </logs remove:1299470943638519890>, </post:1302340870892163093>`,
                        inline: false
                    },
                    {
                        name: `👮‍♂️・${local.moder.label}`,
                        value: '</clear:1285287069676994609>, </anti caps:1299470943638519889>, </anti links:1299470943638519889>',
                        inline: false
                    },
                    {
                        name: `🪙・${local.economy.label}`,
                        value: `</balance:1297200872304021504>, </daily:1313136006362562590>`,
                        inline: false
                    },
                    {
                        name: `🔧・${local.util.label}`,
                        value: '</calc:1285287069756690488>, </translate:1285287069756690490>, </weather:1285287069756690491>, </random:1294775882124361819>',
                        inline: false
                    },
                    {
                        name: `🎮・${local.games.label}`,
                        value: '</anime:1294302199869997197>, </coin_flip:1294379110197624924>, `+aura`, `-aura`',
                        inline: false
                    },
                    {
                        name: `🎉・${local.fun.label}`,
                        value: '</rp:1299513629934223493>, </marry:1302061890201063454>, </nsfw:1293672483869949973>, </ship:1295137310584864868>, </ben:1292452492986155051>, </ball:1300172412628762656>',
                        inline: false
                    }
                ],
                author: {
                    name: lang.request + interaction.user.displayName,
                    icon_url: interaction.user.displayAvatarURL(),
                },
            };
            interaction.reply({embeds: [embed], components: [rowForHelp],});
        }catch (err){
            console.error("Error in file help.js: " + err);
        }
    },
};