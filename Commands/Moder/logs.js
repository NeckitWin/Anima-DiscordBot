const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require(`discord.js`);
const {updateServer, getServer} = require("../../Data/funcs/dbServer");
const {getLang} = require("../../Data/Lang");
const {clearLogCache} = require("../../Data/funcs/logCache");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`logs`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNameLocalizations({ru: `логи`, pl: `logi`, uk: `логи`})
        .setDescription(`Set the channel for logs`)
        .setDescriptionLocalizations({
            ru: `Установить канал для логов`,
            pl: `Ustaw kanał dla logów`,
            uk: `Встановити канал для логів`
        })
        .addSubcommand(subcommand => subcommand
            .setName(`set`)
            .setNameLocalizations({ru: `установить`, pl: `ustaw`, uk: `встановити`})
            .setDescription(`Set the channel for logs`)
            .setDescriptionLocalizations({
                ru: `Установить канал для логов`,
                pl: `Ustaw kanał dla logów`,
                uk: `Встановити канал для логів`
            })
            .addChannelOption(option => option
                .setName(`channel`)
                .setNameLocalizations({ru: `канал`, pl: `kanał`, uk: `канал`})
                .setDescription(`Channel for logs`)
                .setDescriptionLocalizations({
                    ru: `Канал для логов`,
                    pl: `Kanał dla logów`,
                    uk: `Канал для логів`
                })
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName(`remove`)
            .setNameLocalizations({ru: `удалить`, pl: `usuń`, uk: `видалити`})
            .setDescription(`Remove the channel for logs from the server`)
            .setDescriptionLocalizations({
                ru: `Удалить канал для логов с сервера`,
                pl: `Usuń kanał dla logów z serwera`,
                uk: `Видалити канал для логів з сервера`
            })
        ),
    async execute(interaction) {
        const {options, guild} = interaction;
        const subcommand = options.getSubcommand();
        const lang = await getLang(interaction);
        const local = lang.logs;
        if (!guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({content: lang.error.commandforadmin, ephemeral: true});

        const guildID = guild.id;
        clearLogCache(guildID);

        const guildName = guild.name;
        const {logs} = await getServer(guildID, guildName);

        const embed = new EmbedBuilder()
            .setTitle(local.title);

        if (subcommand === `set`) {
            const channel = options.getChannel(`channel`);
            const channelID = channel.id;
            if (logs === channelID) {
                embed.setDescription(local.same).setColor(`#ffd600`);
                return await interaction.reply({embeds: [embed], ephemeral: true});
            }
            if (channel.type !== 0) {
                embed.setDescription(local.nottext).setColor(`#d80000`);
                return await interaction.reply({embeds: [embed], ephemeral: true});
            }
            await updateServer(guildID, "logs", BigInt(channelID));
            embed.setDescription(`${local.set} <#${channelID}>`).setColor(`#00ff9d`);
            await interaction.reply({embeds: [embed], ephemeral: true});
        } else if (subcommand === `remove`) {
            embed.setColor(`#d80000`);
            if (logs == false) {
                embed.setDescription(local.notset);
                return await interaction.reply({embeds: [embed], ephemeral: true});
            }
            await updateServer(guildID, "logs", 0);
            embed.setDescription(local.remove);
            await interaction.reply({embeds: [embed], ephemeral: true});
        }
    }
}