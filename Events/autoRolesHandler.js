const {Events} = require('discord.js');
const {getAutoRoles, removeAutoRole} = require("../Data/funcs/dbAutoRoles");
const {commandLog} = require("../Data/funcs/commandLog");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const autoRoles = await getAutoRoles(member.guild.id);
            if (!autoRoles.length > 0) return;
            if (!commandLog("autoRolesHandler", member)) return;
            if (member.user.bot) return;
            const botMember = await member.guild.members.fetch(member.client.user.id);
            const botRole = botMember.roles.highest;

            for (const role of autoRoles) {
                const guildRole = member.guild.roles.cache.get(role.roleID);
                const rolePosition = guildRole.position;
                if (!guildRole || rolePosition >= botRole.position) {
                    await removeAutoRole(member.guild.id, role.roleID);
                    continue;
                }
                await member.roles.add(guildRole);
            }
        } catch (err) {
            console.error(err);
        }
    }
}