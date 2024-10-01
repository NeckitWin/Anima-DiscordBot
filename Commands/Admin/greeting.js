const {SlashCommandBuilder, ModalBuilder} = require(`discord.js`);

const modal = new ModalBuilder().setTitle(`test`)
    .setCustomId(`myModal`)
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`greeting`)
        .setDescription(`Greet the new members of the server`),
    async execute(interaction) {
        if (interaction.user.id !== "429562004399980546") return await interaction.reply({content: `in development`, ephemeral: true})
        await interaction.showModal(modal);
    }
}