const {Events} = require(`discord.js`);
const path = require("node:path");
const fs = require("node:fs");

module.exports = {
    name: Events.PresenceUpdate,
    async execute(oldPresence, newPresence) {
        const status = newPresence.status;
        const precense = newPresence.activities[0];
        const precenseType = precense?.type ?? false;
        if (!precenseType) return;
        const precenseState = precense?.state;
        const guildID = newPresence.guild.id;
        const member = newPresence.member;

        if (precenseType !== 4) return;
        const filePath = path.join(__dirname, `../Data/jsons/secretCodes.json`);
        const secretCodeData = await fs.promises.readFile(filePath, `utf8`);
        const secretCodeJSON = JSON.parse(secretCodeData);
        if (!secretCodeJSON[guildID]) return;
        const secretCode = secretCodeJSON[guildID].find(item => item.code === precenseState && item.status === status);
        if (!secretCode) return;
        const secretRole = newPresence.guild.roles.cache.get(secretCode.role);
        if (!secretCode) return;
        return await member.roles.add(secretRole);
    }
}