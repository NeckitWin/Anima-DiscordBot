const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`);
const {getLang} = require("../../Data/Lang");

const answers = [
    {value:"yes", gif:"https://media.tenor.com/nIsnQBxoRjkAAAAM/ben-yes.gif", color: "#007a00"},
    {value:"no", gif:"https://media.tenor.com/QcztFcpQ0C4AAAAM/talking-ben-talking.gif", color: "#ca0000"},
    {value: "blabla", gif: "https://media.tenor.com/fr6i8VzKJuEAAAAM/talking-ben-ugh.gif", color: "#0066ff"},
    {value: "haha", gif: "https://media1.tenor.com/m/ysXC0XFeXycAAAAC/talking-ben-ben.gif", color: "#ffcc7f"}
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ben`)
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