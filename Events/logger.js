const {} = require("discord.js");

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        console.log(`${message.guild}|${message.author.username} - ${message.content}`);
    }
}