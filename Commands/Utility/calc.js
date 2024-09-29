const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

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
        try {
            const result = eval(expression);
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Calculator')
                .setDescription("🔢 **Calculation:**\n```js\n"+expression+"```\n✅ **Result:**\n```js\n"+result+"```")
                .setThumbnail("https://i.pinimg.com/originals/50/da/8c/50da8c44ba216bd8d5c20992bc8ce939.gif");

            await interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    },
}