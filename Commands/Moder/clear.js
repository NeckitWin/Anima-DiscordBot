const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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

        // if (!member.permissions.has('ManageMessages')) {
        //     return interaction.reply({content: `You don't have permission to use this command`, ephemeral: true});
        // }

        if (amount <= 0 || amount > 100) {
            interaction.reply({content: `You must delete at least 1 message and no more than 100 messages`, ephemeral: true});
        } else {
            await interaction.channel.bulkDelete(amount, true);

            interaction.reply({content: `Deleted ${amount} messages`});
        }
    },
};