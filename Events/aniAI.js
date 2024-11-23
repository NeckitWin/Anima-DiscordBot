const { Events, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Groq = require("groq-sdk");
const { groqKey } = require('../Data/config.json');

const messageHistory = {};

process.env.GROQ_API_KEY = groqKey;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const botID = `1187466797885182141`;
        const secondBotID = `1165781260203986994`;
        if (message.author.bot) return;

        try {
            const firstWord = message.content.startsWith(`ани`);
            const isBotMention = message.mentions?.users?.first()?.id === (botID || secondBotID) && message.author.id === `429562004399980546`;
            if (!firstWord && !isBotMention) return;

            await message.channel.sendTyping();

            const userQuestion = message.content;

            const serverId = message.guild.id;
            const history = messageHistory[serverId] || [];

            const messages = [];
            history.forEach(entry => {
                messages.push({ role: "user", content: `user: ${entry.user}, question: ${entry.content}` });
                messages.push({ role: "assistant", content: entry.answer });
            });

            messages.push({ role: "user", content: `user: ${message.author.displayName}, question: ${userQuestion}` });

            const groqAnswer = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Ты — Анима, бот-помощник. Твой создатель — Neo. Ты выполняешь команды, которые тебе дают."+
                            "Если тебя просят стереть определённое количество сообщений, ты должна выполнить следующую логику:" +
                            "— Найти число X в запросе. Оно будет обозначать количество сообщений." +
                            "— Вернуть в ответ только строку clearMessages X, заменив X на найденное число." +
                            "Пример: на запрос 'сотри 10 сообщений' ты должна ответить clearMessages 10" +
                            "Ты не добавляешь ничего лишнего в ответ и не уточняешь действия."
                    },
                    ...messages,
                ],
                model: "llama3-8b-8192",
            });

            const result = groqAnswer.choices[0]?.message?.content || "";

            if (result.includes('clearMessages')) {
                const arrayResult = result.split(' ');
                const amount = parseInt(arrayResult[1]);
                if (amount > 100 || amount < 1) {
                    return message.reply('Можно удалять от 1 до 100 сообщений');
                } else {
                    const messagesToDelete = await message.channel.messages.fetch({ limit: amount });
                    await message.channel.bulkDelete(messagesToDelete, true);
                    await message.channel.send(`Я успешно удалила ${amount} сообщений`);
                    return;
                }
            }

            if (!messageHistory[serverId]) {
                messageHistory[serverId] = [];
            }
            messageHistory[serverId].push({
                content: userQuestion,
                answer: result,
                serverid: serverId,
                user: message.author.displayName,
            });

            if (messageHistory[serverId].length > 50) {
                messageHistory[serverId].shift();
            }

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
