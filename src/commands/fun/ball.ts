import {SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction} from "discord.js";
import { getLang } from "../../utils/lang.ts";
import errorLog from "../../utils/errorLog.ts";

const answers = [
    {value: "yes", color: 0x00ff95},
    {value: "no", color: 0xff0044},
    {value: "maybe", color: 0x00c4ff},
    {value: "tryAgain", color: 0xfffd7a},
    {value: "certain", color: 0x52cc00},
    {value: "doubtful", color: 0xff6c6c},
];

export default {
    data: new SlashCommandBuilder()
        .setName('ball')
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
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const question = interaction.options.getString(`question`);
            const answer = answers[Math.floor(Math.random() * answers.length)];
            const lang = await getLang(interaction);
            const local = lang.ball;

            const embedLoading = new EmbedBuilder()
                .setTitle(local.loading)
                .setColor(`#00ffec`)
                .setImage(`https://c.tenor.com/sl3UIRK455QAAAAC/tenor.gif`);

            await interaction.reply({embeds: [embedLoading]});

            const embed = new EmbedBuilder()
                .setTitle(`${local.answer} - ${local[answer.value]}`)
                .setDescription(`${local.question}: ${question}`)
                .setColor(answer.color)
                .setThumbnail(`https://media.tenor.com/gZs8-gPtIxIAAAAi/magic.gif`);
            setTimeout(async () => {
                await interaction.editReply({embeds: [embed]});
            }, 3 * 1000);
        } catch (err) {
            await errorLog(err);
        }
    }
}