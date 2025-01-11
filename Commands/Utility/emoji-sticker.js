const {ContextMenuCommandBuilder, ApplicationCommandType} = require(`discord.js`);
const commandName = `emoji-sticker`;

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName(commandName)
        .setNameLocalizations({ru: `стикер-эмодзи`, pl: `naklejka-emoji`, uk: `стікер-емодзі`})
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {}
}