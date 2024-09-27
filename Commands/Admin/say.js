const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Send by bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('text')
                .setDescription('the text you want to send')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getString('text');
        await interaction.reply({ content: `Sending your message...`, ephemeral: true });
        await interaction.channel.send({content: target});
    }
}