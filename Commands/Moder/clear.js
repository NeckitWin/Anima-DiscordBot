const { SlashCommandBuilder } = require('discord.js');

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
            return interaction.reply({ content: 'You dont have permissions to use this command', ephemeral: true });
        }
        // Проверяем, что количество сообщений находится в диапазоне от 1 до 100
        if (amount <= 0 || amount > 100) {
            await interaction.reply({ content: 'You need to input a number between 1 and 100.', ephemeral: true });
        } else { // Если все проверки пройдены, удаляем сообщения и отвечаем пользователю
            await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true });
        }
    },
};