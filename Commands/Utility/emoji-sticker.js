const {SlashCommandBuilder} = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`emoji-sticker`)
        .setDescription(`Get a emoji or sticker from message`)
        .setIntegrationTypes(1)
        .setContexts(0, 1, 2)
        .setNameLocalizations({ru: `эмодзи-стикер`, pl: `emoji-sticker`, uk: `емодзі-стікер`})
        .setDescriptionLocalizations({
            ru: `Получить эмодзи или стикер из сообщения`,
            pl: `Uzyskaj emoji lub naklejkę z wiadomości`,
            uk: `Отримати емодзі або стікер з повідомлення`
        }),
    async execute(interaction) {
        await interaction.reply({content: 'This is a test command', ephemeral: true});
    }
}