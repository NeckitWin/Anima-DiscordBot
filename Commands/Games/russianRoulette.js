const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

console.log("command Games/russianRoulette.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('russian-roulette')
        .setDescription('play russian roulette')
        .setNameLocalizations({ru: 'русская-рулетка', pl: 'rosyjska-rouletka', uk: 'руська-рулетка'})
        .setDescriptionLocalizations({ru: 'сыграть в русскую рулетку', pl: 'zagraj w rosyjską ruletkę', uk: 'зіграти в руську рулетку'})
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({ru: 'пользователь', pl: 'użytkownik', uk: 'користувач'})
                .setDescription('The user to play with')
                .setDescriptionLocalizations({ru: 'пользователь, с которым хотите поиграть', pl: 'użytkownik, z którym chcesz zagrać', uk: 'користувач, з яким хочете зіграти'})
                .setRequired(true)),

    async execute(interaction) {
        let user = interaction.options.getUser('user');
        let ownerGameId = interaction.user.id;
        let participantId = user.id;
        global.ownerGameId = ownerGameId;
        global.participantId = participantId;

        const ButtonAccept = new ButtonBuilder()
            .setCustomId('acceptRR')
            .setLabel('Принять игру')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success);
        const ButtonReject = new ButtonBuilder()
            .setCustomId('rejectRR')
            .setLabel('Отклонить игру')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Danger);

        const rowRussianRoulette = new ActionRowBuilder()
            .addComponents(ButtonAccept, ButtonReject);

        const embed = {
            color: 65407,
            title: 'Русская рулетка',
            description: `${user} вы хотите сыграть в русскую рулетку с ${interaction.user}?`,
            fields: [
                {
                    // правила
                    name: '📜 Правила',
                    value: "```Игроки выбирают очередность пули в барабане и по очереди нажимают на спусковой крючок. Если револьвер выстрелит, то игрок проиграл.```",
                    inline: false,
                }
            ],
        }

        await interaction.reply({
            content: `${user}`,
            embeds: [embed],
            components: [rowRussianRoulette],
            ephemeral: false
        });
    }
}
