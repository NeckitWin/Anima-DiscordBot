const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const lang = require("../../Data/Lang");



module.exports = {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Calculate the expression')
        .setNameLocalizations({ru: 'калькулятор', pl: 'kalkulator', uk: 'калькулятор'})
        .setDescriptionLocalizations({
            ru: 'Посчитать выражение',
            pl: 'Oblicz wyrażenie',
            uk: 'Обчислити вираз'
        })
        .addStringOption(option =>
            option.setName('expression')
                .setDescription('The expression to calculate')
                .setNameLocalizations({ru: 'выражение', pl: 'wyrażenie', uk: 'вираз'})
                .setDescriptionLocalizations({
                    ru: 'Выражение для вычисления',
                    pl: 'Wyrażenie do obliczenia',
                    uk: 'Вираз для обчислення'
                })
                .setRequired(true)),
    async execute(interaction) {
        const expression = interaction.options.getString('expression');

        let preferredLang = interaction.guild.preferredLocale;
        if (!lang.hasOwnProperty(preferredLang)) preferredLang = 'en';
        let local = lang[preferredLang].calc;

        const safeEval = (expression) => {
            try {
                if (/^[0-9+\-*/().\s]+$/.test(expression)) {
                    return eval(expression);
                } else {
                    return local.error;
                }
            } catch (error) {
                return console.error(error);
            }
        }

        const result = safeEval(expression);
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(local.title)
            .setDescription(`🔢 **${local.calc}:**\n\`\`\`js\n${expression}\`\`\`\n✅ **${local.res}:**\n\`\`\`js\n${result}\`\`\``)
            .setThumbnail("https://i.pinimg.com/originals/50/da/8c/50da8c44ba216bd8d5c20992bc8ce939.gif");

        await interaction.reply({embeds: [embed]});

    }
}