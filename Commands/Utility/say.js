const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Send by bot')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('the text you want to send')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getString('text');
        interaction.reply({content: target});
    }
}