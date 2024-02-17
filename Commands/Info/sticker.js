const { SlashCommandBuilder, CommandInteraction, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sticker')
        .setDescription('Отправить стикер'),
    async execute(interaction) {
        // Проверка, содержит ли сообщение стикер
        if (!interaction.options.get('sticker')) {
            return interaction.reply('Вы не указали стикер!');
        }

        const sticker = interaction.options.get('sticker').value;

        // Скачивание стикера в оперативную память
        const stickerURL = `https://cdn.discordapp.com/stickers/${sticker}.png`;
        const response = await fetch(stickerURL);
        const stickerBuffer = await response.buffer();

        // Отправка стикера как изображения
        const attachment = new AttachmentBuilder(stickerBuffer, 'sticker.png');
        await interaction.reply({ files: [attachment] });
    }
};