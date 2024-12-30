const {SlashCommandBuilder} = require(`discord.js`)
const {getLang} = require("../../Data/Lang");
const {commandLog} = require("../../Data/funcs/commandLog");
const commandName = 'nsfw';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(`NSFW Anime Content`)
        .setNameLocalizations({ru: `нсфв`, pl: `nsfw`, uk: `нсфв`})
        .setDescriptionLocalizations({
            ru: `NSFW Аниме контент`,
            pl: `Zawartość NSFW Anime`,
            uk: `NSFW Аніме контент`
        })
        .addStringOption(option =>
            option.setName(`search`)
                .setNameLocalizations({ru: `поиск`, pl: `szukaj`, uk: `пошук`})
                .setDescription(`Specify a tag to search for`)
                .setDescriptionLocalizations({
                    ru: `Укажите тег для поиска`,
                    pl: `Określ tag do wyszukania`,
                    uk: `Вкажіть тег для пошуку`
                })
                .setRequired(true))
        .addIntegerOption(option => option
            .setName(`count`)
            .setNameLocalizations({ru: `количество`, pl: `liczba`, uk: `кількість`})
            .setDescription(`Number of images to show`)
            .setDescriptionLocalizations({
                ru: `Количество изображений для показа`,
                pl: `Liczba obrazów do pokazania`,
                uk: `Кількість зображень для показу`
            }).setRequired(true)),
    async execute(interaction) {
        if (!commandLog(commandName, interaction)) return;
        const count = interaction.options.getInteger('count');
        const lang = await getLang(interaction);
        const local = lang.nsfw;
        if (count < 1 || count > 10) return await interaction.reply({content: local.errcount, ephemeral: true});
        const parentChannel = interaction.channel?.parent;
        try {
            if (!interaction.guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});
            if (interaction.guild && !(interaction.channel.nsfw || parentChannel.nsfw)) return await interaction.reply({content: local.error, ephemeral: true});
            await interaction.deferReply();

            const target = interaction.options.getString('search');
            const request = target.replace(/ /g, '%20');

            const data = await fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=1000&tags=${request}`);
            const jsonData = data.ok ? await data.json() : null;

            if (!jsonData || jsonData.length === 0) return await interaction.followUp({
                content: local.noresult,
                ephemeral: true
            });

            const sendResultsPromises = [];

            for (let i = 0; i < count; i++) {
                const random = Math.floor(Math.random() * jsonData.length);
                const response = jsonData[random];

                sendResultsPromises.push(interaction.followUp(response.file_url));
            }

            await Promise.all(sendResultsPromises);
        } catch (e) {
            console.error(e);
            await interaction.editReply({content: local.noresult, ephemeral: true});
        }
    }

}