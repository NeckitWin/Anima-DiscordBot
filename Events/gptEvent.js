const {Client, Message} = require('discord.js');
const config = require('../Data/config.json')
const OpenAI = require("openai");

process.env.OPENAI_API_KEY = config.apiKey;

console.log("event gptEvent.js loaded✅");

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        const OwnerId = "429562004399980546";
        const BotId = "1165781260203986994";
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        if (((message.content.toLowerCase().startsWith('anima')) || (message.content.toLowerCase().startsWith('анима'))) || ((repliedMessage.author.id === BotId) && (message.author.id === OwnerId))) {
            const openai = new OpenAI();
            if (message.author.id !== OwnerId) return;
            if (message.author.bot) return;
            try {
                let conversationLog = [
                    {
                        "role": "system",
                        "content": "Ты - Discord бот женского рода, тебя зовут Anima, ты любишь анима и разговариваешь очень мило, добавляешь к своим предложениям: ('Няяя','Мяу','Эххь' и подобные милые фразы), и ты должна общаться на русском языке. У тебя есть один хозяин - NeckitWin, только он к тебе и может обращаться. Обращайся к нему по имени 'Никита'"
                    },
                    {"role": "user", "content": message.content}
                ];

                conversationLog.push({
                    role: 'user',
                    content: message.content,
                });

                await message.channel.sendTyping();

                const result = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: conversationLog
                })

                message.reply(result.choices[0].message.content);
            } catch (error) {
                console.error(error);
                console.log("Error in gptEvent.js");
            }
        } else {
            return;
        }
    }
};