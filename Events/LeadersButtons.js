const {Events} = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        switch (interaction.customId) {
            case "nextLeaders":
                interaction.reply("In development");
                break;
            case "prevLeaders":
                interaction.reply("In development");
                break;
        }
    }
}