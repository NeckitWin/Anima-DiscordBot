const {SlashCommandBuilder} = require('discord.js');

console.log("command Fun/emote.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emote')
        .setDescription('Show your emotions in the chat!')
        .setNameLocalizations({ru: 'эмоция', pl: 'emocja', uk: 'емоція'})
        .setDescriptionLocalizations({
            ru: 'Покажите свои эмоции в чате!',
            pl: 'Pokaż swoje emocje w czacie!',
            uk: 'Покажіть свої емоції в чаті'
        })
    ,
    async execute(interaction) {
        await interaction.reply({content: "test"});
    },
}