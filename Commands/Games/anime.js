const {SlashCommandBuilder} = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription(`Guess the anime by the picture`)
        .setNameLocalizations({ru: `аниме`, pl: `anime`, uk: `аниме`})
        .setDescriptionLocalizations({
            ru: `Угадай аниме по картинке`,
            pl: `Zgadnij anime po obrazku`,
            uk: `Вгадай аніме за зображенням`
        }),
    async execute(interaction) {
        try {
    
        } catch (e) {
            console.error(e)
        }
    }
}