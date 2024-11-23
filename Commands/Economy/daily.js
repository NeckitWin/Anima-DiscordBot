const {SlashCommandBuilder} = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`daily`)
        .setDescription(`Get your daily reward`)
        .setNameLocalizations({ru: `ежедневнка`, pl: `dobówka`, uk: `щоденка`})
        .setDescriptionLocalizations({
            ru: `Получить ежедневное вознаграждение`,
            pl: `Dostać codzienną nagrodę`,
            uk: `Отримати щоденне винагородження`
        }),
    async execute(interaction) {
        
    }
}