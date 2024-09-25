const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

const data = require("../../Data/jsons/interaction.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("interaction")
        .setDescription("interaction with someone")
        .addStringOption(option =>
            option.setName("your_interaction")
                .setDescription("Choose your interaction")
                .addChoices(data.interaction)
                .setRequired(true))
        .addUserOption(option =>
            option.setName("user")
                .setDescription("choose the user")
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getString("your_interaction");
        const mentionUser = interaction.options.getUser("user");

        const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.user.displayName} ${target} you`, iconURL: interaction.user.displayAvatarURL()})
            .setImage(data[target][Math.floor(Math.random() * data[target].length)]);

        interaction.reply({content: `${mentionUser}`, embeds: [embed]});
    }
}