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
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('bullets')
                .setNameLocalizations({ru: 'пули', pl: 'kule', uk: 'кулі'})
                .setDescription('Number of bullets in the gun')
                .setDescriptionLocalizations({ ru: 'Количество пуль в револьвере', pl: 'Liczba kul w rewolwerze', uk: 'Кількість куль в револьвері'})
                .setRequired(true)),

    async execute(interaction) {
        let user = interaction.options.getUser('user');
        let bullets = interaction.options.getInteger('bullets');

        if (bullets < 1 || bullets > 6) {
            return interaction.reply({ content: 'Выберите число пуль от 1 до 6.', ephemeral: true });
        }

        if (bullets === 6) {
            return interaction.reply({ content: 'Вы не можете выбрать 6 пуль, потому-что это приводит к мгновенному поражению.', ephemeral: true });
        }

        // Шанс проигрыша
        const chanceOfLosing = (bullets / 6) * 100;

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
                    value: "```Игроки по очереди нажимают на спусковой крючок. Если револьвер выстрелит, то игрок проиграл.```",
                    inline: false,
                },
                {
                    name: '🔫 Пуль в револьвере',
                    value: "```"+bullets+"```",
                    inline: true,
                },
                {
                    name: '💥 Шанс проигрыша',
                    value: "```"+chanceOfLosing.toFixed(2)+"%```",
                    inline: true,
                },
            ],
        }

        await interaction.reply({
            content: `${user}`,
            embeds: [embed],
            components: [rowRussianRoulette],
            ephemeral: false
        });

        console.log(user.id)

        module.exports.getData = () => {
            return {
                userRR: user.id,
            }
        }
    }
}