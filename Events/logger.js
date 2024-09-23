const {} = require("discord.js");

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (!message.author.bot) return console.log(`${message.guild}|${message.author.username} - ${message.content}`);
    }
}