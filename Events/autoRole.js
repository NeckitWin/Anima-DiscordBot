const {Events, PermissionsBitField} = require(`discord.js`);
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            if (member.user.bot) return;
            const botMember = member.guild.members.me;
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;
            let serverID = member.guild.id;
            const pathFile = path.join(__dirname, '../Data/jsons/autoRoleServers.json');
            const botRolePosition = botMember.roles.highest.position;
            const data = await fs.promises.readFile(pathFile, 'utf8');
            const jsonData = JSON.parse(data);

            const foundServer = jsonData.find(el => el.server === serverID);
            if (!foundServer) return;
            foundServer.roles.forEach(roleID => {
                const autoRole = member.guild.roles.cache.get(roleID);
                if (autoRole) {
                    if (botRolePosition > autoRole.position) member.roles.add(autoRole);
                } else {
                    const parseJSON = JSON.stringify(jsonData, null, 2)
                    foundServer.roles = foundServer.roles.filter(id => id !== roleID);
                    fs.promises.writeFile(pathFile, parseJSON);
                }
            });
        } catch (e) {
            console.error(e);
        }
    }
}