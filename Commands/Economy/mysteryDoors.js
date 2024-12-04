const {SlashCommandBuilder} = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`mystery-doors`)
        .setDescription(`Open one of the doors and get a prize!`)
        .setNameLocalizations({
            ru: `тайные-двери`,
            pl: `tajemnicze-drzwi`,
            uk: `таємні-двері`
        })
        .setDescriptionLocalizations({
            ru: `Откройте одну из дверей и получите приз!`,
            pl: `Otwórz jedne z drzwi i wygraj nagrodę!`,
            uk: `Відкрийте одні з дверей і отримайте приз!`
        }),
    async execute(interaction) {

    }
}