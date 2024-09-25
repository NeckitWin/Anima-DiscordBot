const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

const data = require("../../Data/jsons/reaction.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reaction")
        .setDescription("react to a message")
        .addStringOption(option =>
            option.setName("your_reaction")
                .setDescription("Put your reaction")
                .addChoices(data.reactions)
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getString("your_reaction");
        const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.user.displayName} ${target}`, iconURL: interaction.user.displayAvatarURL()})
            .setImage(data[target][Math.floor(Math.random() * data[target].length)]);

        interaction.reply({embeds: [embed]});
    }
}