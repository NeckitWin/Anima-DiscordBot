const { SlashCommandBuilder } = require('discord.js');
const perm = require('../../Data/perm.json');

console.log("command Moder/clear.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setNameLocalizations({ ru: 'очистить', pl: 'wyczyść', uk: 'очистити' })
        .setDescription('Clears chat for specified amount of messages')
        .setDescriptionLocalizations({
            ru: 'Очищает чат на указанное количество сообщений',
            pl: 'Czyści czat na określoną liczbę wiadomości',
            uk: 'Очищає чат на вказану кількість повідомлень'
        })
        .addIntegerOption(option =>
            option.setName('amount')
                .setNameLocalizations({ ru: 'количество', pl: 'ilość', uk: 'кількість' })
                .setDescription('amount of messages to clear')
                .setDescriptionLocalizations({
                    ru: 'Количество сообщений для удаления',
                    pl: 'Ilość wiadomości do usunięcia',
                    uk: 'Кількість повідомлень для видалення'
                })
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const amount = interaction.options.getInteger('amount');
        // Проверяем, есть ли у пользователя права на удаление сообщений
        if (!member.permissions.has('ManageMessages')) {
            const response = {
                'default': perm.default,
                'ru': perm.ru,
                'pl': perm.pl,
                'uk': perm.uk
            };
            const locale = interaction.locale && response.hasOwnProperty(interaction.locale) ? interaction.locale : 'default';
            const replyMessage = response[locale];
            return interaction.reply(replyMessage);
        }
        // Проверяем, что количество сообщений находится в диапазоне от 1 до 100
        if (amount <= 0 || amount > 100) {
            const response = {
                'ru': 'Количество сообщений должно быть в диапазоне от 1 до 100',
                'pl': 'Liczba wiadomości musi być w zakresie od 1 do 100',
                'uk': 'Кількість повідомлень повинна бути в діапазоні від 1 до 100',
                'default': 'Amount of messages must be in range from 1 to 100'
            };
            const locale = interaction.locale && response.hasOwnProperty(interaction.locale) ? interaction.locale : 'default';
            const replyMessage = response[locale];
            return interaction.reply(replyMessage);
        } else { // Если все проверки пройдены, удаляем сообщения и отвечаем пользователю
            await interaction.channel.bulkDelete(amount, true);
            const response = {
                'default': `${amount} messages deleted`,
                'ru': `Удалено ${amount} сообщений`,
                'pl': `Usunięto ${amount} wiadomości`,
                'uk': `Видалено ${amount} повідомлень`
            };
            const locale = interaction.locale && response.hasOwnProperty(interaction.locale) ? interaction.locale : 'default';
            const replyMessage = response[locale];
            await interaction.reply(replyMessage);
        }
    },
};