const { Interaction, MessageButton, MessageActionRow, ButtonStyle, MessageEmbed, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const {LocalStorage} = require('node-localstorage');

// npm install node-localstorage
const localStorage = new LocalStorage('./Data');

console.log("Events/buttonsClickOffer loaded✅");

let reactions = {};

// Загрузка данных из LocalStorage при запуске
if (localStorage.getItem('reactions')) {
    reactions = JSON.parse(localStorage.getItem('reactions'));
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (interaction.isButton() && (interaction.customId === 'like' || interaction.customId === 'dislike')) {
            const messageId = interaction.message.id;
            const userId = interaction.user.id;

            if (!reactions[messageId]) {
                reactions[messageId] = {likes: 0, dislikes: 0, voters: {}};
            }

            const previousVote = reactions[messageId].voters[userId];

            if (interaction.customId === previousVote) {
                return interaction.reply({content: 'You have already voted!', ephemeral: true});
            }

            if (interaction.customId === 'like') {
                reactions[messageId].likes++;
                if (previousVote) {
                    reactions[messageId].dislikes--;
                }
            } else if (interaction.customId === 'dislike') {
                reactions[messageId].dislikes++;
                if (previousVote) {
                    reactions[messageId].likes--;
                }
            }

            reactions[messageId].voters[userId] = interaction.customId;

            const like = new ButtonBuilder()
                .setCustomId('like')
                .setLabel(reactions[messageId].likes.toString())
                .setEmoji('👍')
                .setStyle(ButtonStyle.Success);

            const dislike = new ButtonBuilder()
                .setCustomId('dislike')
                .setLabel(reactions[messageId].dislikes.toString())
                .setEmoji('👎')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder()
                .addComponents(like, dislike);

            await interaction.update({components: [row]});

            // Сохранение данных в LocalStorage после каждого обновления
            localStorage.setItem('reactions', JSON.stringify(reactions));
        }
    }
}