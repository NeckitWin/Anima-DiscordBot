const {SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

console.log("command Admin/technicalProblem.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('technical_problem')
        .setNameLocalizations({ru: 'техническая_проблема', pl: 'problem_techniczny', uk: 'технічна_проблема'})
        .setDescription('Report a technical problem')
        .setDescriptionLocalizations({
            ru: 'Сообщить о технической проблеме',
            pl: 'Zgłoś problem techniczny',
            uk: 'Повідомити про технічну проблему'
        }),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('modalTP')
            .setTitle('Сообщите о технической проблеме')
        const topic = new TextInputBuilder()
            .setCustomId('topicTP')
            .setPlaceholder('Введите тему технической проблемы')
            .setLabel('Тема')
            .setMinLength(4)
            .setMaxLength(50)
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId('descriptionTP')
            .setPlaceholder('Введите очень подробное описание технической проблемы, пожалуйста')
            .setLabel('Описание проблемы')
            .setMinLength(20)
            .setMaxLength(1850)
            .setStyle(TextInputStyle.Paragraph);

        const rowTopicTP = new ActionRowBuilder()
            .addComponents(topic);
        const rowDescriptionTP = new ActionRowBuilder()
            .addComponents(description);

        modal.addComponents(rowTopicTP, rowDescriptionTP);

        await interaction.showModal(modal)

        console.log(topic.value, description.value);
    }
}