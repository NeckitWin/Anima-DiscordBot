const {SlashCommandBuilder, EmbedBuilder, Colors} = require('discord.js');
const randomAnime = require("../../Data/Fun/randomanime.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random-anime')
        .setNameLocalizations({
            ru: 'рандом-аниме',
            uk: 'рандом-аніме',
            pl: 'losowe-anime'
        })
        .setDescription('Get random anime from the list.')
        .setDescriptionLocalizations({
            ru: 'Получить случайное аниме из списка.',
            uk: 'Отримати випадкове аніме зі списку.',
            pl: 'Pobierz losowe anime z listy.'
        }),
    async execute(interaction) {
        try {
            const preferredLang = interaction.guild.preferredLocale; // en, ru, uk, pl
            let random = Math.floor(Math.random() * randomAnime[preferredLang].length);
            let ranime = randomAnime[preferredLang][random];

            const embed = new EmbedBuilder()
                .setTitle(ranime[0])
                .setDescription(ranime[1])
                .setImage(ranime[2])
                .setColor(Colors.DarkRed);
            await interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error('Ошибка при использовании команды randomanime:', error);
            await interaction.reply('Не удалось обработать запрос.');
        }
    }
}