const {Events, Message} = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            const date = new Date();
            console.log( `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`)
            console.log(`${message.guild.name}(${message.channel.name}) - User: ${message.author.username}, Content: ${message.content}`);
        } catch (error) {
            console.error('Error:', error);
            console.log('Failed in miniloggs.js');
        }

    }
}