const {SlashCommandBuilder, PermissionFlagsBits} = require(`discord.js`);
const {updateServer, getServer} = require("../../Data/funcs/dbServer");
const {getLang} = require("../../Data/Lang");

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
        const guildID = guild.id;
        const guildName = guild.name;
        const lang = await getLang(interaction);
        const {logs} = await getServer(guildID, guildName);

        if (subcommand === `set`) {
            const channel = options.getChannel(`channel`);
            const channelID = channel.id;
            await updateServer(guildID, "logs", BigInt(channelID));
            await interaction.reply({content: `<#${channelID}> set as logs channel`, ephemeral: true});
        } else if (subcommand === `remove`) {
            if (!logs) return await interaction.reply({content: `You don't have logs channel`, ephemeral: true});
            await updateServer(guildID, "logs", 0);
            await interaction.reply({content: `Logs channel removed`, ephemeral: true});
        }
    }
}