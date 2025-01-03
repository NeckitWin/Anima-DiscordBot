const {Events, AttachmentBuilder} = require('discord.js');
const fs = require('fs');
const path = require('path');
const {GoogleGenerativeAI} = require("@google/generative-ai");
const {geminiApiKey} = require('../Data/config.json');
const {commandLog} = require("../Data/funcs/commandLog");

const messageHistory = {};

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            if (message.author.bot) return;
            const botID = `1187466797885182141`;
            const firstWord = message.content.split(' ')[0].toLowerCase();
            const isBotNameMention = firstWord === `anima,` || firstWord === `ани` || firstWord === `анима,` || firstWord === `anima` || firstWord === `анима` || firstWord === `<@${botID}>`;
            if (!isBotNameMention) return;
            if (!commandLog("Anima", message, 2)) return;

            await message.channel.sendTyping();

            const userQuestion = `User ID:${message.author.id}, content: ${message.content}`;

            const serverId = message.guild.id;
            const history = messageHistory[serverId] || [];
            const chatHistory = history.map(entry => ({
                role: entry.role,
                parts: [{text: entry.content}]
            }));

            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: `You are Anima, a Discord bot assistant. Your owner is Neo (id: 429562004399980546). Do not address users by their ID. You were created on December 21, 2023. You are female. The current time is: ${new Date()}`
            });

            const chat = model.startChat({history: chatHistory});

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
