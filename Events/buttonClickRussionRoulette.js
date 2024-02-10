const {
    Interaction,
    MessageButton,
    MessageActionRow,
    ButtonStyle,
    MessageEmbed,
    ButtonBuilder,
    ActionRowBuilder, embedLength
} = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const ownerId = global.ownerGameId;
        const participantId = global.participantId;
        if (interaction.isButton() && (interaction.customId === 'acceptRR' || interaction.customId === 'rejectRR')) {
            if (interaction.customId === 'acceptRR') {
                if (interaction.user.id === participantId) {
                    const embed = {
                        color: 65407,
                        title: 'Игра началась!',
                        description: `Выберите очередность пули и прокрутите барабан.`,
                    }
                    const rowBullets = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId('1').setLabel('1').setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('2').setLabel('2').setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('3').setLabel('3').setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('4').setLabel('4').setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('5').setLabel('5').setStyle(ButtonStyle.Primary)
                        );
                    await interaction.update({embeds: [embed], components: [rowBullets]});
                } else {
                    return interaction.reply({
                        content: 'Вы не можете принять игру, потому-что вы не участвуете в ней.',
                        ephemeral: true
                    });
                }
            } else if (interaction.customId === 'rejectRR') {
                if (interaction.user.id === interaction.message.mentions.users.first().id) {
                    return interaction.update({content: 'Игра отклонена.', components: [], embeds: []});
                } else {
                    return interaction.reply({
                        content: 'Вы не можете отклонить игру, потому-что вы не участвуете в ней.',
                        ephemeral: true
                    });
                }
            }
        }
        if (interaction.isButton() && ['1', '2', '3', '4', '5'].includes(interaction.customId)) {
            let bullets = parseInt(interaction.customId);
            global.bullets = bullets;
            const winRate = (5 - bullets) / 5 * 100;

            console.log(bullets);

            const embed = {
                color: 65407,
                title: 'Игра началась!',
                description: `Вероятность выигрыша: ${winRate.toFixed(2)}%. Количество пуль: ${bullets}.`,
            }
            const shot = new ButtonBuilder()
                .setCustomId('shot')
                .setLabel('Выстрелить')
                .setEmoji('🔫')
                .setStyle(ButtonStyle.Success);
            const rowShot = new ActionRowBuilder()
                .addComponents(shot);
            await interaction.update({embeds: [embed], components: [rowShot]});
        }

        if (interaction.isButton() && (interaction.customId === 'shot')) {
            let randomNum = Math.floor(Math.random() * 5) + 1;
            if (randomNum === global.bullets) {
                return interaction.update({
                    content: `${interaction.user} проиграл!`,
                    components: [],
                    embeds: [],
                    ephemeral: false
                });
            } else {
                if (global.bullets >= 1) {
                    const embed = {
                        color: 65407,
                        title: 'Участник выжил!',
                        description: `Количество пуль: ${global.bullets}.`,
                    }
                    const shot = new ButtonBuilder()
                        .setCustomId('shot')
                        .setLabel('Выстрелить')
                        .setEmoji('🔫')
                        .setStyle(ButtonStyle.Success);
                    const rowSecondShot = new ActionRowBuilder()
                        .addComponents(shot);
                    let nextPlayerId;
                    if (interaction.user.id === global.ownerGameId) {
                        nextPlayerId = global.participantId;
                    } else {
                        nextPlayerId = global.ownerGameId;
                    }
                    return interaction.update({
                        content: `Вы выжили! Следующий игрок: <@${nextPlayerId}>`,
                        embeds: [embed],
                        components: [rowSecondShot],
                        ephemeral: false
                    });
                } else {
                    return interaction.update({
                        content: 'Игра окончена! Все выжили',
                        components: [],
                        embeds: [],
                        ephemeral: false
                    });
                }
            }
        }
    }
}