const { Events, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} = require("@google/generative-ai");
const { geminiApiKey } = require('../Data/config.json');

const messageHistory = {};

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const botID = `1187466797885182141`;
        if (message.author.bot) return;

        try {
            return;
            const firstWord = message.content.split(' ')[0].toLowerCase();
            const isBotNameMention = firstWord === `anima,` || firstWord === `ани` || firstWord === `анима,` || firstWord === `anima` || firstWord === `анима` || firstWord === `<@${botID}>`;
            if (!isBotNameMention) return;

            await message.channel.sendTyping();
            const userQuestion = `User ID:${message.author.id}, content: ${message.content}`;

            const serverId = message.guild.id;
            const history = messageHistory[serverId] || [];
            const chatHistory = history.map(entry => ({
                role: entry.role,
                parts: [{ text: entry.content }]
            }));

            const systemSettings = `You are Anima, a Discord bot assistant. Your owner is Neo (id: 429562004399980546). Do not address users by their ID. You were created on December 21, 2023. You are female. The current time is: ${new Date()}`;

            const safetySettings = [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE
                }
            ];


            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",  systemInstruction:  systemSettings, safetySettings: safetySettings});

            const chat = model.startChat({ history: chatHistory });

            const image = message.attachments.size > 0 ? message.attachments.first() : false;
            const isImage = image.contentType.startsWith('image');

            let inline;
            if (isImage) {

                const imageUrl = image.url;
                const imageResponse = await fetch(imageUrl).then((response)=>response.arrayBuffer());


                inline = [{
                    inlineData: {
                        data: Buffer.from(imageResponse).toString("base64"),
                        mimeType: image.contentType,
                    }
                }, message.content]

                const result = await model.generateContent(inline);
                const responseText = result.response.text();
                return console.log(responseText);

            }

            let result = await chat.sendMessage(userQuestion);

            const responseText = result.response.text();

            if (!messageHistory[serverId]) {
                messageHistory[serverId] = [];
            }
            messageHistory[serverId].push({
                role: "user",
                content: userQuestion
            });
            messageHistory[serverId].push({
                role: "model",
                content: responseText
            });

            if (messageHistory[serverId].length > 300) {
                messageHistory[serverId] = messageHistory[serverId].slice(-100);
            }

            if (responseText.length < 1990) {
                await message.reply(responseText);
            } else {
                const filePath = path.join(__dirname, 'temp.txt');
                await fs.promises.writeFile(filePath, responseText, 'utf8');
                const attachment = new AttachmentBuilder(filePath, 'message.txt');
                await message.reply({ files: [attachment] })
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
