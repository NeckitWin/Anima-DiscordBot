const {Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require(`discord.js`);
const fetch = require(`node-fetch2`);

const getStickerFormat = (format) => {
    switch (format) {
        case 1:
            return `png`;
        case 2:
            return `apng`;
        case 3:
            return `lottie`;
        case 4:
            return `gif`;
    }
}

module.exports = [
    {
        // emoji-sticker
        name: Events.InteractionCreate,
        async execute(message) {
            if (!message.isMessageContextMenuCommand()) return;
            if (message.commandName !== `emoji-sticker`) return;
            try {
                const messageID = message.targetId;
                const getMessage = await message.channel?.messages.fetch(messageID) || false;
                if (!getMessage) return await message.reply({content: `I don't have access to this guild`, ephemeral: true});
                const sticker = getMessage.stickers?.first() || false;

                const emojiContent = getMessage.content.match(/<a?:\w+:\d+>/g);
                const emojiID = emojiContent ? emojiContent[0].match(/\d+/g)[0] : false;

                if (emojiID) {
                    const imageGif = `https://cdn.discordapp.com/emojis/${emojiID}.gif`
                    const imagePng = `https://cdn.discordapp.com/emojis/${emojiID}.png`
                    const imageWebp = `https://cdn.discordapp.com/emojis/${emojiID}.webp`
                    const checkResponse = await fetch(imageGif);
                    const emojiPreview = await checkResponse.ok ? imageGif : `https://cdn.discordapp.com/emojis/${emojiID}.webp`;
                    const embed = new EmbedBuilder()
                        .setImage(emojiPreview);

                    const buttonPng = new ButtonBuilder()
                        .setURL(imagePng)
                        .setLabel(`PNG`)
                        .setStyle(ButtonStyle.Link);

                    const buttonGif = new ButtonBuilder()
                        .setURL(imageGif)
                        .setLabel(`GIF`)
                        .setStyle(ButtonStyle.Link);

                    const buttonWebp = new ButtonBuilder()
                        .setURL(imageWebp)
                        .setLabel(`WEBP`)
                        .setStyle(ButtonStyle.Link);

                    const components = [buttonPng, buttonWebp];
                    if (checkResponse.ok) components.push(buttonGif);

                    const row = new ActionRowBuilder()
                        .addComponents(components);

                    await message.reply({embeds: [embed], components: [row], ephemeral: true});
                } else if (sticker) {
                    const stickerID = sticker.id;
                    const stickerType = sticker.format;
                    const stickerURL = `https://media.discordapp.net/stickers/${stickerID}.${getStickerFormat(stickerType)}`;
                    const embed = new EmbedBuilder()
                        .setImage(stickerURL);

                    const buttonSticker = new ButtonBuilder()
                        .setURL(stickerURL)
                        .setLabel(getStickerFormat(stickerType).toUpperCase())
                        .setStyle(ButtonStyle.Link);

                    const row = new ActionRowBuilder()
                        .addComponents(buttonSticker);

                    await message.reply({embeds: [embed], components: [row], ephemeral: true});
                } else {
                    await message.reply({content: `No emoji or sticker found`, ephemeral: true});
                }
            } catch (e) {
                console.error(e);
            }
        }
    },
    {
        name: Events.InteractionCreate,
        async execute(message) {
            if (!message.isMessageContextMenuCommand()) return;
            if (message.commandName !== `adv`) return;
            try {

            } catch (e) {
                console.error(e);
            }
        }
    }
]