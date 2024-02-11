const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate text')
        .setNameLocalizations({ru: 'перевод', pl: 'tłumaczenie', uk: 'переклад'})
        .setDescriptionLocalizations({
            ru: 'Перевести текст',
            pl: 'Przetłumacz tekst',
            uk: 'Перекласти текст'
        })
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to translate')
                .setNameLocalizations({ru: 'текст', pl: 'tekst', uk: 'текст'})
                .setDescriptionLocalizations({
                    ru: 'Текст для перевода',
                    pl: 'Tekst do przetłumaczenia',
                    uk: 'Текст для перекладу'
                })
                .setRequired(true))
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The language to translate to')
                .setNameLocalizations({ru: 'язык', pl: 'język', uk: 'мова'})
                .setDescriptionLocalizations({
                    ru: 'Язык, на который нужно перевести',
                    pl: 'Język, na który chcesz przetłumaczyć',
                    uk: 'Мова, на яку потрібно перекласти'
                })
                .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const target = interaction.options.getString('language');

        try {
        const option = {
            method: 'GET',
            url: 'https://cilenisapi.p.rapidapi.com/language_identifier',
            params: {
                text: text,
                target: target
            },
            headers: {
                'X-RapidAPI-Key': '7d462982a9msha52233327eccbdap1c7892jsndc68297b44b5',
                'X-RapidAPI-Host': 'cilenisapi.p.rapidapi.com'
            }
        };

        const translation = await axios.request(option);

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Перевод')
                .setDescription('🌐 **Исходный текст:**\n```'+text+'```\n🔤 **Перевод:**\n```'+translation.data+'```');

            await interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error(error);
            await interaction.reply('Произошла ошибка при переводе текста.');
        }
    }
}