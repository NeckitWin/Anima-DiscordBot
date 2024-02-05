const {SlashCommandBuilder, MessageEmbed, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('offer')
        .setNameLocalizations({ru: 'предложение', pl: 'oferta', uk: 'пропозиція'})
        .setDescription('Create an offer')
        .setDescriptionLocalizations({ru: 'Создать предложение', pl: 'Utwórz ofertę', uk: 'Створити пропозицію'})
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the offer')
                .setNameLocalizations({ru: 'заголовок', pl: 'tytuł', uk: 'заголовок'})
                .setDescriptionLocalizations({
                    ru: 'Заголовок предложения',
                    pl: 'Tytuł oferty',
                    uk: 'Заголовок пропозиції'
                })
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the offer')
                .setNameLocalizations({ru: 'описание', pl: 'opis', uk: 'опис'})
                .setDescriptionLocalizations({ru: 'Описание предложения', pl: 'Opis oferty', uk: 'Опис пропозиції'})
                .setRequired(true)),
    async execute(interaction) {
        var likes = 0;
        var dislikes = 0;
        module.exports.likes = likes;
        module.exports.dislikes = dislikes;
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const like = new ButtonBuilder()
            .setCustomId('like')
            .setLabel(likes.toString())
            .setEmoji('👍')
            .setStyle(ButtonStyle.Success);

        const dislike = new ButtonBuilder()
            .setCustomId('dislike')
            .setLabel(dislikes.toString())
            .setEmoji('👎')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(like, dislike);

        const embed = {
            color: 65407, // Используйте предпочтительный цвет
            title: title,
            thumbnail: {
                url: interaction.user.displayAvatarURL({dynamic: true}),
            },
            fields: [
                {
                    name: '',
                    value: '```'+description+'```',
                    inline: false,
                },
            ],
            timestamp: new Date(),
        };

        const sentMessage = await interaction.reply({embeds: [embed], components: [row], fetchReply: true});
        module.exports.messageId = sentMessage.id;
    }
}