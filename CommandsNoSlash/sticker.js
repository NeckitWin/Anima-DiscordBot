const {AttachmentBuilder} = require('discord.js');
const fs = require('fs');
const path = require('path');
const https = require('https');

const formats = {
    PNG: 1,
    GIF: 4
}

module.exports = {
    name: 'sticker',
    description: 'Send sticker',
    async execute(message) {
        if (!message.channel.permissionsFor(message.client.user).has("SendMessages")) return;
        if (!message.reference) return message.reply('You didn\'t reply message!');

        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);

        if (!referencedMessage.stickers.size > 0) return message.reply('In message with you replied hasn\'t sticker!');

        const stickerId = referencedMessage.stickers.first().id;
        const stickerFormat = referencedMessage.stickers.first().format;
        let stickerUrl;
        let filePath;
        let attachment

        switch (stickerFormat) {
            case formats.PNG:
                stickerUrl = `https://media.discordapp.net/stickers/${stickerId}.png`;
                filePath = path.join(__dirname, 'sticker.png');
                attachment = new AttachmentBuilder(filePath, 'sticker.png');
                break;
            case formats.GIF:
                stickerUrl = `https://media.discordapp.net/stickers/${stickerId}.gif`;
                filePath = path.join(__dirname, 'sticker.gif');
                attachment = new AttachmentBuilder(filePath, 'sticker.gif');
                break;
            default:
                console.log(referencedMessage.stickers.first());
        }

        const file = fs.createWriteStream(filePath);
        https.get(stickerUrl, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    message.reply({files: [attachment]}).then(()=>{
                        fs.unlink(filePath, (err) => {
                            if (err) console.error(err);
                        });
                    })
                })
            })
        })
    }
}