const {ContextMenuCommandBuilder, ApplicationCommandType} = require(`discord.js`);

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName(`describe-picture`)
        .setNameLocalizations({ru: `описать-картинку`, pl: `opisz-obraz`, uk: `описати-картинку`})
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {

    }
}