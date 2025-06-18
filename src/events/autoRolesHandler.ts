import { Events } from 'discord.js';
import { getAutoRoles, removeAutoRole } from '../repo/rolesRepository.ts';
import { commandLog } from '../utils/commandLog.ts';
import errorLog from "../utils/errorLog.ts";

export default {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const autoRoles = await getAutoRoles(member.guild.id);
            if (!autoRoles.length > 0) return;
            if (!await commandLog("autoRolesHandler", member)) return;
            if (member.user.bot) return;
            const botMember = await member.guild.members.fetch(member.client.user.id);
            const botRole = botMember.roles.highest;

            for (const role of autoRoles) {
                const guildRole = member.guild.roles.cache.get(role.roleId);
                const rolePosition = guildRole.position;
                if (!guildRole || rolePosition >= botRole.position) {
                    await removeAutoRole(member.guild.id, role.roleId);
                    continue;
                }
                await member.roles.add(guildRole);
            }
        } catch (err) {
            await errorLog(err);
        }
    }
}