const { Events, Message } = require('discord.js');

console.log('Events/emoji loaded✅');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (!message.guild || !message.content) return;

        let messageCount = 0;

        message.client.on(Events.MessageCreate, async (message) => {
            messageCount++;

            const randomNumber = Math.floor(Math.random() * 20);

            if (randomNumber === messageCount && messageCount === 10) {
                messageCount = 0;

                const emojis = message.guild.emojis.cache;
                const randomEmoji = emojis.random();

                await message.react(randomEmoji);
            }
        });
    },
};
