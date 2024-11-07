const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require(`discord.js`);
const {getLang} = require("../../Data/Lang");
const path = require("node:path");
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`language`)
        .setNameLocalizations({ru: `язык`, pl: `język`, uk: `мова`})
        .setDescription(`Set language for your server`)
        .setDescriptionLocalizations({
            ru: `Установить язык для вашего сервера`,
            pl: `Ustaw język dla swojego serwera`,
            uk: `Встановити мову для вашого сервера`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
        let lang = await getLang(interaction);
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({content: lang.error.commandforadmin, ephemeral: true});
        const target = interaction.options.getString('language');
        const serverID = interaction.guild.id;

        const pathFile = path.join(__dirname, `../../Data/jsons/lang.json`);
        const jsonData = await fs.promises.readFile(pathFile, 'utf8');
        const data = JSON.parse(jsonData);

        const thisServer = data.find(el => el.serverid === serverID);

        if (thisServer) {
            thisServer.lang = target;
            data.filter(el => el.serverid !== serverID);
            data.push(thisServer);
        } else {
            data.push({serverid: serverID, lang: target});
        }

        const newData = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(pathFile, newData, 'utf8');

        lang = await getLang(interaction);
        const local = lang.language;

        const embed = new EmbedBuilder()
            .setTitle(local.title)
            .setDescription(`${local.description} ${target}`)
            .setColor(`#d998ff`);

        await interaction.reply({content: " ", embeds: [embed], ephemeral: true});

    }
}