const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setNameLocalizations({ru: 'сказать', pl: 'powiedz', uk: 'сказати'})
        .setDescription('Send message by bot')
        .setDescriptionLocalizations({
            ru: 'Отправить сообщение ботом',
            pl: 'Wyślij wiadomość przez bota',
            uk: 'Відправити повідомлення ботом'
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('text')
                .setNameLocalizations({ru: 'текст', pl: 'tekst', uk: 'текст'})
                .setDescription('the text you want to send')
                .setDescriptionLocalizations({
                    ru: 'Текст, который вы хотите отправить',
                    pl: 'Tekst, który chcesz wysłać',
                    uk: 'Текст, який ви хочете відправити'
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        const lang = await getLang(interaction);
        const local = lang.say;
        const target = interaction.options.getString('text');
        await interaction.reply({ content: local.response, ephemeral: true });
        await interaction.channel.send({content: target});
    }
}