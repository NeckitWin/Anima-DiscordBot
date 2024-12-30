const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`);
const {getLang} = require("../../Data/Lang");
const {commandLog} = require("../../Data/funcs/commandLog");
const commandName = 'random';

const gifs = [
    "https://media1.tenor.com/m/6cMOFYs7U5AAAAAC/crazy-slots-spin.gif",
    "https://media1.tenor.com/m/nUv86-2KId0AAAAC/casino-gambling.gif",
    "https://media1.tenor.com/m/u5qKQfM69VwAAAAC/casino.gif"

]

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setNameLocalizations({ru: `рандом`, pl: `losowy`, uk: `рандом`})
        .setDescription(`Generates a random number`)
        .setDescriptionLocalizations({
            ru: `Генерирует случайное число`,
            pl: `Generuje losową liczbę`,
            uk: `Генерує випадкове число`
        })
        .addIntegerOption(option => option
            .setName(`min`)
            .setNameLocalizations({ru: `мин`, pl: `min`, uk: `мін`})
            .setDescription(`Minimum value`)
            .setDescriptionLocalizations({
                ru: `Минимальное значение`,
                pl: `Minimalna wartość`,
                uk: `Мінімальне значення`
            })
            .setRequired(true))
        .addIntegerOption(option => option
            .setName(`max`)
            .setNameLocalizations({ru: `макс`, pl: `max`, uk: `макс`})
            .setDescription(`Maximum value`)
            .setDescriptionLocalizations({
                ru: `Максимальное значение`,
                pl: `Maksymalna wartość`,
                uk: `Максимальне значення`
            })
            .setRequired(true)),
    async execute(interaction) {
        if (!commandLog(commandName, interaction)) return;
        const lang = await getLang(interaction);
        const local = lang.random;
        try {
            const min = interaction.options.getInteger(`min`);
            const max = interaction.options.getInteger(`max`);
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
            const random = Math.floor(Math.random() * (max - min + 1)) + min;

            const embed = new EmbedBuilder()
                .setTitle(local.title)
                .setDescription(`${local.generate}\n ${local.from} \`${min}\` ${local.to} \`${max}\``)
                .setColor(`#ffbd2e`)
                .setImage(randomGif);

            await interaction.reply({embeds: [embed]});

            setTimeout(()=>{
                embed.setDescription(`${local.random}: \`${random}\``);
                embed.setImage(null);
                embed.setColor(`#82ff2e`);
                interaction.editReply({embeds: [embed]});
            }, 3*1000)
        } catch (e) {
            console.error(e)
        }
    }
}