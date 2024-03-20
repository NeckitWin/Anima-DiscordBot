const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('interaction')
        .setDescription('Show your interactions!')
        .addUserOption( option => option
            .setName('user')
            .setDescription('User to interact with')
            .setNameLocalizations({
                "ru": "пользователь",
                "pl": "użytkownik",
                "uk": "користувач"
            })
            .setDescriptionLocalizations({
                "ru": "Пользователь для взаимодействия",
                "pl": "Użytkownik do interakcji",
                "uk": "Користувач для взаємодії"
            })
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('interaction')
            .setDescription('Text to show interactions')
            .setNameLocalizations({
                "ru": "взаимодействие",
                "pl": "interakcja",
                "uk": "взаємодія"
            })
            .setDescriptionLocalizations({
                "ru": "Текст для показа взаимодействий",
                "pl": "Tekst do pokazania interakcji",
                "uk": "Текст для показу взаємодій"
            })
            .addChoices(
                {
                    name: "Hug",
                    value: "hug"
                },
                {
                    name: "Kiss",
                    value: "kiss"
                },
                {
                    name: "Slap",
                    value: "slap"
                }
            )
        ),
    async execute(interaction) {
        await interaction.reply({content: `В разработке...`, ephemeral: true});
    }
}