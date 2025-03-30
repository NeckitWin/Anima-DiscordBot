import {ContextMenuCommandBuilder, ApplicationCommandType} from 'discord.js';

export default {
    data: new ContextMenuCommandBuilder()
        .setName(`emoji-sticker`)
        .setNameLocalizations({ru: `стикер-эмодзи`, pl: `naklejka-emoji`, uk: `стікер-емодзі`})
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {}
}