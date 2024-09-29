const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require(`discord.js`)

const buttonAccept = new ButtonBuilder()
    .setCustomId(`rpsAccept`)
    .setEmoji(`👍`)
    .setStyle(ButtonStyle.Success);

const buttonDecline = new ButtonBuilder()
    .setCustomId(`rpsDecline`)
    .setEmoji(`👎`)
    .setStyle(ButtonStyle.Danger);

const row = new ActionRowBuilder().addComponents(buttonAccept, buttonDecline);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`rps`)
        .setDescription(`Rock, Paper, Scissors game`)
        .addUserOption(option => option
            .setName(`user`)
            .setDescription(`choose a user you want to play the game with`)
            .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser(`user`);

        await interaction.reply({content: `test`, components: [row]})
    }
}