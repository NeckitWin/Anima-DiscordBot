const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`);
const {getLang} = require("../../Data/Lang");
const commandName = 'ben';
const answers = [
    {value: "yes", gif: "https://media1.tenor.com/m/nIsnQBxoRjkAAAAC/ben-yes.gif", color: "#007a00"},
    {value: "no", gif: "https://media1.tenor.com/m/F1bdsKaYe2gAAAAC/ben-no.gif", color: "#ca0000"},
    {value: "ugh", gif: "https://media1.tenor.com/m/fr6i8VzKJuEAAAAd/talking-ben-ugh.gif", color: "#0066ff"},
    {value: "haha", gif: "https://media1.tenor.com/m/agrQMQjQTzgAAAAd/talking-ben-laugh.gif", color: "#ffcc7f"}
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(`Ask a question and get an answer`)
        .setNameLocalizations({ru: `бен`, pl: `ben`, uk: `бен`})
        .setDescriptionLocalizations({
            ru: `Задайте вопрос и получите ответ`,
            pl: `Zadaj pytanie i otrzymaj odpowiedź`,
            uk: `Задайте питання і отримайте відповідь`
        })
        .addStringOption(option =>
            option.setName(`question`)
                .setNameLocalizations({ru: `вопрос`, pl: `pytanie`, uk: `питання`})
                .setDescription(`Ask a question`)
                .setDescriptionLocalizations({
                    ru: `Задайте вопрос`,
                    pl: `Zadaj pytanie`,
                    uk: `Задайте питання`
                })
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString(`question`);
        const answer = answers[Math.floor(Math.random() * answers.length)];
        const lang = await getLang(interaction);
        const answerLang = lang.ben[answer.value];

        const embed = new EmbedBuilder()
            .setTitle(answerLang)
            .setDescription(`${lang.ben.question}: ${question}`)
            .setColor(answer.color)
            .setImage(answer.gif);

        await interaction.reply({content: ``, embeds: [embed]});
    }
}