const {Message, AttachmentBuilder} = require('discord.js');
const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} = require("@google/generative-ai");
const config = require('../Data/config.json');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch2');

process.env.GOOGLE_API_KEY = config.geminiApiKey;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

module.exports = {
    name: 'messageCreate',
    async execute(message = new Message()) {
        const botID = `1187466797885182141`;
        if (message.author.bot) return;
        try {
            const firstWord = message.content.split(' ')[0].toLowerCase();
            const isBotNameMention = firstWord === `anima,` || firstWord === `анима,` || firstWord === `anima` || firstWord === `анима` || firstWord === `<@${botID}>`;
            if (!isBotNameMention) return;

            await message.channel.sendTyping();

            let buffer;
            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                if (attachment.contentType && attachment.contentType.startsWith('image/')) {
                    const imageUrl = attachment.url;

                    const response = await fetch(imageUrl);
                    buffer = await response.buffer();
                }
            }

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: "You are a Discord Bot (Anima girl character). Your name is Anima. You are a helpful assistant.",
                safetySettings: [
                    {category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE},
                    {category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE},
                    {category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE},
                    {category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE}
                ]
            });
            const prompt = message.content;

            const generate = await model.generateContent(
                message.attachments.size > 0 ? [prompt, {
                    inlineData: {
                        data: buffer.toString("base64"),
                        mimeType: message.attachments.first().contentType
                    }
                }] : prompt
            );
            let result = generate.response.text();
            result = result.replace(/@/g, "");

            if (result.length < 1990) {
                await message.reply(result);
            } else {
                const filePath = path.join(__dirname, 'temp.txt');
                await fs.promises.writeFile(filePath, result, 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return message.reply("error in console");
                    }
                });
                const attachment = new AttachmentBuilder(filePath, 'message.txt');
                await message.reply({files: [attachment]})
                    .then(() => fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    }));
            }
        } catch (e) {
            console.error(e);
        }
    }
};
