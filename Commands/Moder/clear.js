const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setNameLocalizations({ ru: 'очистить', pl: 'wyczyść', uk: 'очистити' })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)),
    async execute(interaction) {
        const lang = await getLang(interaction);
        const local = lang.clear;
        try {
        const amount = interaction.options.getInteger('amount');
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({content: lang.error.botdontpermclear, ephemeral: true});

        if (amount < 1 || amount > 100) {
            interaction.reply({content: local.amount, ephemeral: true});
        } else {
            await interaction.channel.bulkDelete(amount, true);

            interaction.reply({content: `${local.successFirst} ${amount} ${local.successSecond}`});
        }
        } catch (err) {
            console.error(err);
            return interaction.reply({content: lang.error.botdontperm, ephemeral: true});
        }
    }
}