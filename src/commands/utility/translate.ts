import {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction
} from 'discord.js';
import axios from 'axios';
import errorLog from "../../utils/errorLog.ts";

export default {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setNameLocalizations({ru: 'перевести', pl: 'przetłumacz', uk: 'перекласти'})
        .setDescription('Translate text')
        .setDescriptionLocalizations({ru: 'Перевести текст', pl: 'Przetłumacz tekst', uk: 'Перекласти текст'})
        .addStringOption(option =>
            option.setName('language')
                .setNameLocalizations({ru: 'язык', pl: 'język', uk: 'мова'})
                .addChoices(
                    {name:'english', value:'en'},
                    {name:'русский', value:'ru'},
                    {name:'polski', value:'pl'},
                    {name:'українська', value:'uk-ua'},
                    {name:'japanese', value:'ja'},
                )
                .setDescription('The language.ts to translate to')
                .setDescriptionLocalizations({ru: 'Язык для перевода', pl: 'Język do tłumaczenia', uk: 'Мова для перекладу'})
                .setRequired(true))
        .addStringOption(option =>
            option.setName('text')
                .setNameLocalizations({ru: 'текст', pl: 'tekst', uk: 'текст'})
                .setDescription('The text to translate')
                .setDescriptionLocalizations({ru: 'Текст для перевода', pl: 'Tekst do tłumaczenia', uk: 'Текст для перекладу'})
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const text = interaction.options.getString('text');
            const target = interaction.options.getString('language');
            const response = await axios.get(`https://translate.googleapis.com/translate_a/single?format=text&client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURI(text!)}`);
            const [[[ translated ]]] = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`Translation into ${target}`)
                .setDescription("**Text:**\n```"+text+"```\n**Translate:**\n```"+translated+"```")
                .setColor('Blue')
                .setThumbnail('https://cdn.dribbble.com/users/1341307/screenshots/3641494/google_translate.gif');

            await interaction.reply({embeds: [embed]});
        } catch (err) {
            await errorLog(err);
        }
    }
}