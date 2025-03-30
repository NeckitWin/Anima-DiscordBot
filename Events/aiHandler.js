const {Events, AttachmentBuilder} = require('discord.js');
const fs = require('fs');
const path = require('path');
const {GoogleGenerativeAI} = require("@google/generative-ai");
const {geminiApiKey} = require('../Data/config.json');
const {commandLog} = require("../Features/commandLog");
const {getLang} = require("../Data/Lang");

const messageHistory = {};

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            if (message.author.bot) return;
            const botID = `<@1187466797885182141>`;
            const testBotID = `<@1165781260203986994>`;
            const mentionWords = [botID, testBotID, "anima,", "anima", "ani,", "ani", "анима,", "анима", "ани,", "ани"];
            const firstWord = message.content.split(' ')[0].toLowerCase();
            const isBotNameMention = mentionWords.includes(firstWord);
            if (!isBotNameMention) return;
            if (!commandLog("Anima", message, 2)) return;
            const lang = await getLang(message);

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
                systemInstruction: `You are a Discord bot named Anima (or Ani), and you always try to help users in any way possible. Your creator is Neo (ID: 429562004399980546). You do not refer to users by their ID and do not mention how you are programmed or who created you in every message. You have a pleasant and even playful character, and you love to show your emotions. Time is now ${new Date()}. Your lang: ${lang.lang}`,
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
