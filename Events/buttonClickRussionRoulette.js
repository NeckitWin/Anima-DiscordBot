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
                        image: {url: "https://media1.tenor.com/m/fklGVnlUSFQAAAAd/russian-roulette.gif"},
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
                        content: 'Вы не можете принять игру, она не была вам предложена.',
                        ephemeral: true
                    });
                }
            } else if (interaction.customId === 'rejectRR') {
                if (interaction.user.id === participantId || interaction.user.id === ownerId) {
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

            const embed = {
                color: 65407,
                title: 'Игра началась!',
                description: `Вероятность выигрыша: ${winRate.toFixed(2)}%. Очередность пули в барабане: ${bullets}.`,
                image: {url: "https://media1.tenor.com/m/cFiADUaTHvAAAAAC/reload-cartoon.gif"},
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
                const embedEnd = {
                    color: 65407,
                    title: 'Игра окончена!',
                    description: `Поздравляем победителя!`,
                    image: {url: "https://media1.tenor.com/m/a32y8NjpL-EAAAAC/buckshot-roulette.gif"},
                }
                return interaction.update({
                    content: `${interaction.user} проиграл!`,
                    components: [],
                    embeds: [embedEnd],
                    ephemeral: false
                });
            } else {
                    const embed = {
                        color: 65407,
                        title: 'Участник выжил!',
                        description: `Очередь пули в барабане: ${global.bullets}. \n \*Прокрутка барабана...\*`,
                        image: {url: "https://media1.tenor.com/m/VWbgqoZOPawAAAAd/buckshot-roulette.gif"},
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

                    // if (interaction.user.id !== global.ownerGameId){
                    //     return interaction.reply({
                    //         content: "Сейчас не ваша очередь!",
                    //         ephemeral: true
                    //     })
                    // }
                    return interaction.update({
                        content: `Вы выжили! Следующий игрок: <@${nextPlayerId}>`,
                        embeds: [embed],
                        components: [rowSecondShot],
                        ephemeral: false
                    });
            }
        }
    }
}