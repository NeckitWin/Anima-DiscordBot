const {Events} = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (!message.author.bot) return console.log(`${message.guild}|${message.author.username} - ${message.content}`);
    }
}