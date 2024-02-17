const {CommandInteraction, AttachmentBuilder} = require('discord.js');



module.exports = {
    name: 'sticker',
    description: 'Отправить стикер',
    async execute(message) {
        if (!message.reference) {
            return message.reply('Вы не ответили на сообщение!');
        }
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);

        if (!referencedMessage.stickers.size > 0) {
            return message.reply('В сообщении, на которое вы ответили, нет стикера!');
        }

        const stickerId = referencedMessage.stickers.first().id;

        await message.reply("Вот ваш стикер в виде изображения:");
        await message.channel.send(`https://media.discordapp.net/stickers/${stickerId}.webp?size=160`);
    }
}