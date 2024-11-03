const { Events, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Groq = require("groq-sdk");
const { groqKey, groqKey2 } = require('../Data/config.json');

const messageHistory = {};

async function createGroqClient(apiKey) {
    return new Groq({ apiKey });
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const botID = `1187466797885182141`;
        if (message.author.bot) return;

        try {
            const firstWord = message.content.split(' ')[0].toLowerCase();
            const isBotNameMention = firstWord === `anima,` || firstWord === `анима,` || firstWord === `anima` || firstWord === `анима` || firstWord === `<@${botID}>`;
            const isBotMention = (message.mentions?.users?.first()?.id === botID && message.author.id !== `429562004399980546`) || false;
            if (!isBotNameMention && !isBotMention) return;

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

            let groqAnswer;
            try {
                const groq = await createGroqClient(groqKey);
                groqAnswer = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are Anima, a Discord bot assistant. You love helping people.",
                        },
                        ...messages,
                    ],
                    model: "llama3-8b-8192",
                });
            } catch (error) {
                console.error("Error with primary API key, trying backup key...", error);

                try {
                    const groqBackup = await createGroqClient(groqKey2);
                    groqAnswer = await groqBackup.chat.completions.create({
                        messages: [
                            {
                                role: "system",
                                content: "You are Anima, a Discord bot assistant. You love helping people.",
                            },
                            ...messages,
                        ],
                        model: "llama3-8b-8192",
                    });
                } catch (backupError) {
                    console.error("Both API keys failed", backupError);
                    return await message.reply("I'm having trouble connecting to the service. Please try again later.");
                }
            }

            let result = groqAnswer.choices[0]?.message?.content || "";

            if (result.includes('@')) {
                result = result.replace(/@/g, ' ');
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

            if (messageHistory[serverId].length > 200) {
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