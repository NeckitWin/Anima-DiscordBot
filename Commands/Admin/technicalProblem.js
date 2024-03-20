const {SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const lang = require('../../Data/Lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('technical-problem')
        .setNameLocalizations({ru: 'техническая-проблема', pl: 'problem-techniczny', uk: 'технічна-проблема'})
        .setDescription('Report a technical problem')
        .setDescriptionLocalizations({
            ru: 'Сообщить о технической проблеме',
            pl: 'Zgłoś problem techniczny',
            uk: 'Повідомити про технічну проблему'
        }),
    async execute(interaction) {
        let preferredLang = interaction.guild.preferredLocale;
        if (!lang.hasOwnProperty(preferredLang)) {
            preferredLang = 'en';
        }
        let local = lang[preferredLang].technicalProblems;

        const modal = new ModalBuilder()
            .setCustomId('modalTP')
            .setTitle(local.title)
        const topic = new TextInputBuilder()
            .setCustomId('topicTP')
            .setLabel(local.topic.label)
            .setPlaceholder(local.topic.title)
            .setMinLength(4)
            .setMaxLength(50)
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId('descriptionTP')
            .setLabel(local.description.label)
            .setPlaceholder(local.description.title)
            .setMinLength(10)
            .setMaxLength(1850)
            .setStyle(TextInputStyle.Paragraph);

        const rowTopicTP = new ActionRowBuilder()
            .addComponents(topic);
        const rowDescriptionTP = new ActionRowBuilder()
            .addComponents(description);

        modal.addComponents(rowTopicTP, rowDescriptionTP);

        await interaction.showModal(modal);
    }
}