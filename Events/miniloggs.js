const {Events, Message} = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            const date = new Date();
            console.log(`[${date.toLocaleDateString()}|${date.toLocaleTimeString()}]:[${message.guild.name}/${message.channel.name}] - user:${message.author.username}, content: ${message.content}`);
        } catch (error) {
            console.error('Error in miniloggs.js:', error);
        }

    }
}