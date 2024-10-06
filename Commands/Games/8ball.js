const {SlashCommandBuilder} = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`8ball`)
        .setDescription(`Ask a question and get an answer`)
        .setNameLocalizations({ru: `шар`, pl: `8ball`, uk: `шар`})
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
        
    }
}