const {Interaction, MessageButton, MessageActionRow, ButtonStyle, MessageEmbed, ButtonBuilder, ActionRowBuilder} = require('discord.js');
const { getData } = require('../Commands/Games/russianRoulette');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isButton() && (interaction.customId === 'acceptRR' || interaction.customId === 'rejectRR')){
            const messageId = messageIdRR;
            let userIdRR = userRR;
            console.log(userIdRR)
            if (userIdRR !== interaction.user.id) {
                return interaction.reply({ content: 'Вы не можете ответить заместо пользователя, которому предложили игру.', ephemeral: true });
            }

            if (interaction.customId === 'acceptRR') {
                const embed = {
                    color: 65407,
                    title: 'Игра началась!',
                    description: `Сейчас ходит ${interaction.user}!`,
                }
                const shot = new ButtonBuilder()
                    .setCustomId('Выстрелить')
                    .setLabel('Выстрелить')
                    .setEmoji('🔫')
                    .setStyle(ButtonStyle.Success);
                const rowShot = new ActionRowBuilder()
                    .addComponents(shot);
                // Обновляем сообщение с новым эмбедом и кнопкой
                await interaction.editReply({ embeds: [embed], components: [rowShot] });
            }else if (interaction.customId === 'rejectRR') {
                return interaction.editReply({ content: 'Игра отклонена.', ephemeral: false });
            }
        }
    }
}