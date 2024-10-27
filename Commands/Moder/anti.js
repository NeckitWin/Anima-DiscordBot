const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require(`discord.js`);
const {getServer, updateServer} = require("../../Data/funcs/dbServer");
const {getLang} = require("../../Data/Lang");

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
            .addIntegerOption(option => option
                .setName(`status`)
                .addChoices([
                    {name: `enable`, name_localizations: {ru: `включить`, pl: `włącz`, uk: `увімкнути`}, value: 1},
                    {name: `disable`, name_localizations: {ru: `отключить`, pl: `wyłącz`, uk: `вимкнути`}, value: 0}
                ])
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
        )
        .addSubcommand(subcommand => subcommand
            .setName(`links`)
            .setNameLocalizations({ru: `ссылки`, pl: `links`, uk: `посилання`})
            .setDescription(`Link restriction on the server`)
            .setDescriptionLocalizations({
                ru: `Ограничение на ссылки на сервере`,
                pl: `Ograniczenie linków na serwerze`,
                uk: `Обмеження посилань на сервері`
            })
            .addIntegerOption(option => option
                .setName(`status`)
                .addChoices([
                    {name: `enable`, name_localizations: {ru: `включить`, pl: `włącz`, uk: `увімкнути`}, value: 1},
                    {name: `disable`, name_localizations: {ru: `отключить`, pl: `wyłącz`, uk: `вимкнути`}, value: 0}
                ])
                .setNameLocalizations({
                    ru: `статус`,
                    pl: `status`,
                    uk: `статус`
                })
                .setDescription(`Enable or disable the link restriction`)
                .setDescriptionLocalizations({
                    ru: `Включить или отключить ограничение на ссылки`,
                    pl: `Włącz lub wyłącz ograniczenie linków`,
                    uk: `Увімкніть або вимкніть обмеження посилань`
                })
                .setRequired(true))
        ),
    async execute(interaction) {
        const {options, guild} = interaction;
        const subcommand = options.getSubcommand();
        const lang = await getLang(interaction);
        const local = lang.anti;
        const botMember = guild.members.me;
        if (!interaction.channel.permissionsFor(botMember).has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({
            content: lang.error.botdontpermmute,
            ephemeral: true
        });
        const guildID = guild.id;
        const guildName = guild.name;


        const embed = new EmbedBuilder()
            .setTitle(local.title)

        if (subcommand === `caps`) {
            const status = options.getInteger(`status`);
            const {antiCaps} = await getServer(guildID, guildName);

            if (status != antiCaps) {
                await updateServer(guildID, "antiCaps", status);
                embed.setColor(`#00ac00`);
                embed.setDescription(`${local.capslockset} ${local[status ? `enabled` : `disabled`]}`);
            } else {
                embed.setColor(`#ba0000`);
                embed.setDescription(`${local.capslockalready} ${local[status ? `enabled` : `disabled`]}`);
            }
            await interaction.reply({embeds: [embed]});
        } else if (subcommand === `links`) {
            const status = options.getInteger(`status`);
            const {antiLinks} = await getServer(guildID, guildName);
            const embed = new EmbedBuilder()
                .setTitle(`Системы автомодерации сервера`)

            if (status != antiLinks) {
                await updateServer(guildID, "antiLinks", status);
                embed.setColor(`#00ac00`);
                embed.setDescription(`Ограничение на использование ссылок ${local[status ? `enabled` : `disabled`]}`);
            } else {
                embed.setColor(`#ba0000`);
                embed.setDescription(`Ограничение на использование ссылок уже было ${local[status ? `enabled` : `disabled`]}`);
            }
            await interaction.reply({embeds: [embed]});
        }
    }
}