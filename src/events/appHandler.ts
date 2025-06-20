import {
    Events,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    Interaction
} from 'discord.js';
import fetch from 'node-fetch';
import { commandLog } from '../utils/commandLog.ts';
import {getStickerFormat} from "../utils/utility.ts";
import errorLog from "../utils/errorLog.ts";


export default [
    {
        // emoji-sticker
        name: Events.InteractionCreate,
        async execute(message: Interaction) {
            if (!message.isMessageContextMenuCommand()) return;
            if (message.commandName !== `emoji-sticker`) return;
            try {
                if (!await commandLog("emoji-sticker", message, 1)) return;
                await message.deferReply({ephemeral: true});
                const messageID = message.targetId;
                const getMessage = await message.channel?.messages.fetch(messageID) || false;
                if (!getMessage) return await message.editReply({
                    content: `I don't have access to this guild`
                });
                const sticker = getMessage.stickers?.first() || false;

                const emojiContent = getMessage.content.match(/<a?:\w+:\d+>/g);
                const emojiID: string | false = emojiContent ? emojiContent[0].match(/\d+/g)![0] : false;

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

                    const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(components);

                    await message.editReply({embeds: [embed], components: [row]});
                } else if (sticker) {
                    const stickerID = sticker.id;
                    const stickerType = sticker.format;
                    const stickerURL = `https://media.discordapp.net/stickers/${stickerID}.${getStickerFormat(stickerType)}`;
                    const embed = new EmbedBuilder()
                        .setImage(stickerURL);

                    const buttonSticker = new ButtonBuilder()
                        .setURL(stickerURL)
                        .setLabel(getStickerFormat(stickerType)!.toUpperCase())
                        .setStyle(ButtonStyle.Link);

                    const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(buttonSticker);

                    await message.editReply({embeds: [embed], components: [row]});
                } else {
                    await message.editReply({content: `No emoji or sticker found`});
                }
            } catch (err) {
                await errorLog(err);
            }
        }
    }
]