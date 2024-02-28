const {SlashCommandBuilder, EmbedBuilder, Colors} = require('discord.js');

console.log("command Fun/emote.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emote')
        .setNameLocalizations({
            "ru": "эмоция",
            "pl": "emocja",
            "uk": "емоція"
        })
        .setDescription('Show your emotions!')
        .setDescriptionLocalizations({
            "ru": "Покажи свои эмоции!",
            "pl": "Pokaż swoje emocje!",
            "uk": "Покажи свої емоції!"
        })
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to show emotions')
                .setDescriptionLocalizations({
                    "ru": "Текст для показа эмоций",
                    "pl": "Tekst do pokazania emocji",
                    "uk": "Текст для показу емоцій"
                })
                .addChoices({
                    name: "Happy",
                    value: "happy"
                }, {
                    name: "Sad",
                    value: "sad"
                }, {
                    name: "Angry",
                    value: "angry"
                }, {
                    name: "Cry",
                    value: "cry"
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const locale = interaction.guild.preferredLocale;

        const embed = new EmbedBuilder()
            .setColor(Colors.Purple)
            .setTitle("Random Emote")
            .setImage("https://api.itslit.uk/emote");
    }
}