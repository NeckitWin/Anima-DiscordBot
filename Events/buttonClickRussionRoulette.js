const {Interaction, MessageButton, MessageActionRow, ButtonStyle, MessageEmbed, ButtonBuilder, ActionRowBuilder} = require('discord.js');
const { bullets } = require('../Commands/Games/russianRoulette');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isButton() && (interaction.customId === 'acceptRR' || interaction.customId === 'rejectRR')){
            if (interaction.customId === 'acceptRR') {
                if (interaction.user.id === interaction.message.mentions.users.first().id) {
                const embed = {
                    color: 65407,
                    title: 'Игра началась!',
                    description: `Сейчас ходит ${interaction.user}!`,
                }
                const shot = new ButtonBuilder()
                    .setCustomId('shot')
                    .setLabel('Выстрелить')
                    .setEmoji('🔫')
                    .setStyle(ButtonStyle.Success);
                const rowShot = new ActionRowBuilder()
                    .addComponents(shot);
                // Обновляем сообщение с новым эмбедом и кнопкой
                await interaction.reply({embeds: [embed], components: [rowShot]});
                } else {
                    return interaction.reply({content: 'Вы не можете принять игру, потому-что вы не участвуете в ней.', ephemeral: true});
                }
            }else if (interaction.customId === 'rejectRR') {
                if (interaction.user.id === interaction.message.mentions.users.first().id) {
                    return interaction.reply({content: 'Игра отклонена.', ephemeral: false});
                }else{
                    return interaction.reply({content: 'Вы не можете отклонить игру, потому-что вы не участвуете в ней.', ephemeral: true});
                }
            }
        }
        if (interaction.isButton() && (interaction.customId === 'shot')){
            console.log(bullets);
            // Генерируем случайное число от 1 до 6
            const randomNum = Math.floor(Math.random() * 6) + 1;

            // Если случайное число меньше или равно количеству пуль, то игрок проигрывает
            if (randomNum <= bullets) {
                // Игрок проиграл
                return interaction.reply({ content: 'Вы проиграли!', ephemeral: false });
            } else {
                // Игрок выжил
                return interaction.reply({ content: 'Вы выжили!', ephemeral: false });
            }
        }
    }
}