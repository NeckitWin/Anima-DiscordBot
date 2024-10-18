const {Events} = require('discord.js');
const {updateAura} = require('../Data/funcs/db');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return; // not bot
        const user_id = message.author.id;
        const username = message.author.username;
        const displayName = message.author.displayName;
        const server_id = message.guild.id;

        try {
            await updateAura(user_id, server_id,"+", 1317, displayName, username);
        } catch (e) {
            console.error(e);
        }
    }
};