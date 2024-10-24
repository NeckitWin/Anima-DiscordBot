const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`);
const {getServer, updateAntiCaps} = require("../../Data/funcs/dbServer");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`anti`)
        .setNameLocalizations({ru: `анти`, pl: `anti`, uk: `анті`})
        .setDescription(`System of automoderation`)
        .setDescriptionLocalizations({
            ru: `Система автомодерации`,
            pl: `System automatycznego moderowania`,
            uk: `Система автомодерації`
            })
        .addSubcommand(subcommand => subcommand
            .setName(`caps`)
            .setNameLocalizations({ru: `капс`, pl: `caps`, uk: `капс`})
            .setDescription(`Caps lock restriction on the server up to 60% of the text`)
            .setDescriptionLocalizations({
                ru: `Ограничение на Caps Lock на сервере до 60% текста`,
                pl: `Ograniczenie Caps Lock na serwerze do 60% tekstu`,
                uk: `Обмеження Caps Lock на сервері до 60% тексту`
            })
            .addBooleanOption(option => option
                .setName(`status`)
                .setNameLocalizations({
                    ru: `статус`,
                    pl: `status`,
                    uk: `статус`
                })
                .setDescription(`Enable or disable the caps lock restriction`)
                .setDescriptionLocalizations({
                    ru: `Включить или отключить ограничение на Caps Lock`,
                    pl: `Włącz lub wyłącz ograniczenie Caps Lock`,
                    uk: `Увімкніть або вимкніть обмеження Caps Lock`
                })
                .setRequired(true))
        ),
    async execute(interaction) {
        const {options, guild} = interaction;
        const subcommand = options.getSubcommand();
        if (subcommand === `caps`) {
            const status = options.getBoolean(`status`);
            const guildID = guild.id;
            const guildName = guild.name;
            const {antiCaps} = await getServer(guildID, guildName);
            const embed = new EmbedBuilder()
                .setTitle(`Anti-Caps Lock`)

            if (status != antiCaps) {
                await updateAntiCaps(guildID, status);
                embed.setColor(`#00ac00`);
                embed.setDescription(`Caps lock restriction has been ${status ? `enabled` : `disabled`}`);
            } else {
                embed.setColor(`#ba0000`);
                embed.setDescription(`Caps lock restriction is already ${status ? `enabled` : `disabled`}`);
            }
            await interaction.reply({embeds: [embed]});
        }
    }
}