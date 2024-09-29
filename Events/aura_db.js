const {Events} = require('discord.js');
const {getUser, postNewUser, updateAura} = require('../Data/funcs/db');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return; // not bot
        const user_id = message.author.id;
        const username = message.author.username;
        const displayname = message.author.displayName;
        const server_id = message.guild.id;

        const ifUserWasDB = await getUser(user_id);

        if (ifUserWasDB) {
            await updateAura(user_id, server_id, `+`, 1317, displayname)
        } else {
            await postNewUser(user_id, server_id, username, displayname);
        }
    }
};