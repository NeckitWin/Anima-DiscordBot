const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const lang = require("../../Data/Lang");

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
                .setRequired(true)),
    async execute(interaction) {
        let preferredLang = interaction.guild.preferredLocale;
        if (!lang.hasOwnProperty(preferredLang)) preferredLang = 'en';
        let local = lang[preferredLang].clear;

        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 100) {
            interaction.reply({content: local.amount, ephemeral: true});
        } else {
            await interaction.channel.bulkDelete(amount, true);

            interaction.reply({content: `${local.successFirst} ${amount} ${local.successSecond}`});
        }
    },
};