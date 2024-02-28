const {Client, Message} = require('discord.js');
const config = require('../Data/config.json')
const OpenAI = require("openai");

process.env.OPENAI_API_KEY = config.apiKey;

console.log("event gptEvent.js loaded✅");

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        const OwnerId = "429562004399980546";
        const BotId = config.clientId;
        const MaxMessageLength = 1990;
        let repliedMessage;
        if (message.reference){
            repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        }
        if (((message.content.toLowerCase().startsWith('anima,')) || (message.content.toLowerCase().startsWith('анима,'))) || ((message.reference) && (repliedMessage.author.id === BotId) && (message.author.id === OwnerId))) {
            const openai = new OpenAI();
            if (message.author.id !== OwnerId) return;
            if (message.author.bot) return;
            try {
                let conversationLog = [
                    {
                        role: "system",
                        content: "Ты - Discord бот женского рода, тебя зовут Anima, ты любишь помогать людям. Так же ты добавляешь к своим предложениям: ('Няяя','Мяу','Эххь' и подобное), и ты должна общаться на том языке, на котором к тебе обращаются. У тебя есть один хозяин - NeckitWin.К тебе может обращаться только один человек, называй его по имени 'Никита'"
                    },
                    {role: "system", content: "Если твоё сообщение содержит код, текст для программирования, или подобное, то обязательно возьми его в тильды, чтобы выделать, пример ```язык\n код```"},
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

                let response = result.choices[0].message.content;

                if (response.length > MaxMessageLength){
                    let chunks = [];
                    for (let i = 0; i < response.length; i += MaxMessageLength) {
                        chunks.push(response.slice(i, i + MaxMessageLength));
                    }

                    for (let chunk of chunks){
                        await message.reply(chunk);
                    }
                } else {
                    await message.reply(response);
                }

            } catch (error) {
                console.error(error);
                console.log("Error in gptEvent.js");
            }
        } else {
            return;
        }
    }
};