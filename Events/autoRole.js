const {Events, PermissionsBitField} = require(`discord.js`);
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const botMember = member.guild.members.me;
        if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) return console.log(`bot doesnt have permission`);
        let serverID = member.guild.id;
        const pathFile = path.join(__dirname, '../Data/jsons/autoRoleServers.json');

        try {
            const data = await fs.promises.readFile(pathFile, 'utf8');
            const jsonData = JSON.parse(data)

            const foundServer = jsonData.find(el => el.server === serverID);
            if (foundServer) {
                const roleID = foundServer.role;
                const autoRole = member.guild.roles.cache.get(roleID);
                if (autoRole) member.roles.add(autoRole);
            } else return;
        } catch (e) {
            console.error(e);
        }

    }
}