const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`);
const {getLang} = require("../../Data/Lang");
const commandName = 'ball';
const answers = [
    {value: "yes", color: "#00ff95"},
    {value: "no", color: "#ff0044"},
    {value: "maybe", color: "#00c4ff"},
    {value: "tryAgain", color: "#fffd7a"},
    {value: "certain", color: "#52cc00"},
    {value: "doubtful", color: "#ff6c6c"},
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(`Ask the magic ball a question and get an answer`)
        .setNameLocalizations({ru: `шар`, pl: `kula`, uk: `куля`})
        .setDescriptionLocalizations({
            ru: `Задайте вопрос магическому шару и получите ответ`,
            pl: `Zadaj pytanie magicznej kuli i otrzymaj odpowiedź`,
            uk: `Задайте питання магічній кулі та отримайте відповідь`
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
        try {
            const question = interaction.options.getString(`question`);
            const answer = answers[Math.floor(Math.random() * answers.length)];
            const lang = await getLang(interaction);
            const local = lang.ball;

            const embedLoading = new EmbedBuilder()
                .setTitle(local.loading)
                .setColor(`#00ffec`)
                .setImage(`https://media1.tenor.com/m/sl3UIRK455QAAAAC/8ball-bart-simpson.gif`);

            await interaction.reply({embeds: [embedLoading]});

            const embed = new EmbedBuilder()
                .setTitle(`${local.answer} - ${local[answer.value]}`)
                .setDescription(`${local.question}: ${question}`)
                .setColor(answer.color)
                .setThumbnail(`https://media.tenor.com/gZs8-gPtIxIAAAAi/magic.gif`);
            setTimeout(async () => {
                await interaction.editReply({embeds: [embed]});
            }, 3 * 1000);
        } catch (error) {
            console.error(error);
        }
    }
}