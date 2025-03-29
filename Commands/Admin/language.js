const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require(`discord.js`);
const {getLang, clearLangCache} = require("../../Data/Lang");
const {updateServer} = require("../../Data/funcs/dbServer");
const commandName = 'language';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setNameLocalizations({ru: `язык`, pl: `język`, uk: `мова`})
        .setDescription(`Set language for your server`)
        .setDescriptionLocalizations({
            ru: `Установить язык для вашего сервера`,
            pl: `Ustaw język dla swojego serwera`,
            uk: `Встановити мову для вашого сервера`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('language')
                .setNameLocalizations({ru: `язык`, pl: `język`, uk: `мова`})
                .setDescription('Choose the language for server')
                .setDescriptionLocalizations({
                    ru: `Выберите язык для сервера`,
                    pl: `Wybierz język dla serwera`,
                    uk: `Виберіть мову для сервера`
                })
                .addChoices(
                    [
                        {name: 'English', value: 'en'},
                        {name: 'Polski', value: 'pl'},
                        {name: 'Русский', value: 'ru'},
                        {name: 'Українська', value: 'uk'}
                    ]
                )
                .setRequired(true)),
    async execute(interaction) {
        try {
            const {guild, options} = interaction;
            let lang = await getLang(interaction);
            if (!guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return await interaction.reply({
                content: lang.error.commandformanageserver,
                ephemeral: true
            });
            const target = options.getString('language');
            const serverID = guild.id;
            await clearLangCache(serverID);
            await updateServer(serverID, 'lang', target);

            lang = await getLang(interaction);
            const local = lang.language;

            const embed = new EmbedBuilder()
                .setTitle(local.title)
                .setDescription(`${local.description} ${target}`)
                .setColor(`#d998ff`);


            await interaction.reply({content: " ", embeds: [embed], ephemeral: true});

        } catch (err) {
            console.error(err);
        }
    }
}