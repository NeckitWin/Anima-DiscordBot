const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate text')
        .addStringOption(option =>
            option.setName('language')
                .addChoices(
                    {name:'english', value:'en'},
                    {name:'русский', value:'ru'},
                    {name:'polski', value:'pl'},
                    {name:'japanese', value:'ja'},
                )
                .setDescription('The language to translate to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to translate')
                .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const target = interaction.options.getString('language');

        try {
            const response = await axios.get(`https://translate.googleapis.com/translate_a/single?format=text&client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURI(text)}`);
            const [[[ translated ]]] = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`Перевод на ${target}`)
                .setDescription("Текст\n```"+text+"```\nПеревод\n```"+translated+"```")
                .setColor('Blue')
                .setThumbnail('https://cdn.dribbble.com/users/1341307/screenshots/3641494/google_translate.gif');

            await interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while translating the text.');
        }
    }
}