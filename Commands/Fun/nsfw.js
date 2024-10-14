const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`)
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`nsfw`)
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
                .setRequired(true)),
    async execute(interaction) {
        const lang = await getLang(interaction);
        try {
            if (!interaction.channel.nsfw) return await interaction.reply({content: lang.nsfw.error, ephemeral: true});
            await interaction.deferReply();

            const target = interaction.options.getString('search');
            const data = await fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=1000&tags=${target}`);
            const jsonData = data.ok ? await data.json() : null;

            if (!jsonData || jsonData.length === 0) return await interaction.followUp({
                content: lang.nsfw.noresult,
                ephemeral: true
            });

            const sendResultsPromises = [];

            for (let i = 0; i < 5; i++) {
                const random = Math.floor(Math.random() * jsonData.length);
                const response = jsonData[random];

                sendResultsPromises.push(interaction.followUp(response.file_url));
            }

            // Ожидание выполнения всех промисов
            await Promise.all(sendResultsPromises);
        } catch (e) {
            console.error(e);
            await interaction.editReply({content: lang.nsfw.noresult, ephemeral: true});
        }
    }

}