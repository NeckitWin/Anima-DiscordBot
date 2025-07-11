import {
    Events, RoleSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder,
    ButtonBuilder, Interaction, ButtonStyle, Role
} from 'discord.js';
import { getLang } from '../utils/lang.ts';
import { commandLog } from '../utils/commandLog.ts';
import { postAutoRole, getAutoRoles, removeAutoRole, clearAutoRoles } from '../repo/rolesRepository.ts';
import errorLog from "../utils/errorLog.ts";
import {checkNotGuild} from "../middleware/checkNotGuild.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        try {
            if (!(interaction.isButton() || interaction.isAnySelectMenu())) return;
            const customIds = ['addAutoRole', 'editAutoRole', 'autoRolesMenu', 'deleteAutoRole', 'clearAutoRoles', 'returnAutoRoles', 'editRolesMenu'];
            if (!customIds.includes(interaction.customId)) return;
            const lang = await getLang(interaction);
            const local = lang.autoroles;
            if (await checkNotGuild(interaction)) return;
            if (interaction.user.id !== interaction.message.interaction!.user.id) return await interaction.reply({
                content: lang.error.notforyou,
                ephemeral: true
            });
            if (!await commandLog("autoRolesDataHandler", interaction, 1)) return;
            // @ts-ignore values are always defined in select menus
            const {message, values, customId, client} = interaction;
            const guild = interaction.guild!;
            let dataAutoRoles = await getAutoRoles(guild.id);
            const botRole = guild.members.cache.get(client.user.id)!.roles.highest;

            const embed = new EmbedBuilder()
                .setTitle(local.title)
                .setColor('#00ff00')
                .setDescription(local.addandedit);

            if (customId === 'autoRolesMenu' || customId === 'returnAutoRoles' || customId === 'clearAutoRoles') {
                if (customId === 'clearAutoRoles') {
                    await clearAutoRoles(guild.id);
                    embed.setDescription(local.clear);
                }
                const menuRole = new RoleSelectMenuBuilder()
                    .setCustomId('autoRolesMenu')
                    .setPlaceholder(local.select)
                    .setDefaultRoles(values ? values[0] : []);

                const rowRoleMenu = new ActionRowBuilder()
                    .addComponents(menuRole);

                const buttonAdd = new ButtonBuilder()
                    .setCustomId('addAutoRole')
                    .setLabel(local.add)
                    .setStyle(ButtonStyle.Success);

                const buttonEdit = new ButtonBuilder()
                    .setCustomId('editAutoRole')
                    .setLabel(local.edit)
                    .setStyle(ButtonStyle.Secondary);

                const rowButtons = new ActionRowBuilder()
                    .addComponents(buttonAdd, buttonEdit);

                await interaction.update({embeds: [embed], components: [rowRoleMenu, rowButtons]})
            } else if (customId === 'addAutoRole') {
                if (dataAutoRoles.length >= 20) {
                    embed.setDescription(`${local.max} - 20`);
                    return await interaction.update({embeds: [embed]});
                }
                // @ts-ignore components are always defined in select menus
                const getRoleFromMenu = message.components[0].components[0].data.default_values;
                if (!getRoleFromMenu) {
                    embed.setDescription(local.firstlySelect);
                    embed.setColor('#e4d100');
                    return await interaction.update({embeds: [embed]});
                }
                const roleId = getRoleFromMenu[0].id;
                const role = guild.roles.cache.get(roleId);
                if (role!.position >= botRole.position) {
                    embed.setDescription(local.rolePosition);
                    embed.setColor('#b80000');
                    return await interaction.update({embeds: [embed]});
                }
                if (role!.permissions.has('Administrator')) {
                    embed.setDescription(local.prohibitAdminRole);
                    embed.setColor('#b80000');
                    return await interaction.update({embeds: [embed]});
                }

                const isSetAutoRole = await postAutoRole(guild.id, roleId);
                if (!isSetAutoRole) {
                    embed.setDescription(local.alreadySet);
                    return await interaction.update({embeds: [embed]});
                }
                embed.setDescription(`<@&${roleId}> ${local.success}`);
                await interaction.update({embeds: [embed]});

            } else if (['editAutoRole', 'editRolesMenu', 'deleteAutoRole'].includes(customId)) {

                embed.setDescription(local.editTitle);

                // @ts-ignore
                const getRoleFromMenu = message.components[0]?.components[0]?.data?.options;
                const getCurrentRole = getRoleFromMenu?.find((role) => role.default);

                if (!dataAutoRoles.length) {
                    embed.setDescription(local.empty);
                    return await interaction.update({embeds: [embed]});
                }

                if (customId === 'deleteAutoRole' && getCurrentRole) {
                    await removeAutoRole(guild.id, getCurrentRole.value);
                    embed.setDescription(`Роль <@&${getCurrentRole.value}> ${local.deleted}`);
                    dataAutoRoles = await getAutoRoles(guild.id);
                }
                const getRoles = dataAutoRoles.map(role => guild.roles.cache.get(role.roleID) || role.roleID);

                for (const role of getRoles) {
                    if (typeof role === "string") await removeAutoRole(guild.id, role);
                }

                let filterRoles = getRoles.filter((role: Role) => typeof role !== "string");

                const menuRole = new StringSelectMenuBuilder()
                    .setCustomId('editRolesMenu')
                    .setPlaceholder(local.select);


                if (customId === 'editRolesMenu') {
                    const selectedRoleID = values[0];
                    const selectedRole = guild.roles.cache.get(selectedRoleID);

                    if (selectedRole) {
                        menuRole.addOptions({
                            label: selectedRole.name,
                            value: selectedRole.id,
                            default: true
                        });

                        filterRoles = filterRoles.filter((role: Role) => role.id !== selectedRoleID);
                    }
                }

                menuRole.addOptions(filterRoles.map((role: Role) => ({
                    label: role.name,
                    value: role.id
                })));

                const returnButton = new ButtonBuilder()
                    .setCustomId('returnAutoRoles')
                    .setLabel(local.return)
                    .setStyle(ButtonStyle.Secondary);

                const buttons = [
                    new ButtonBuilder().setCustomId('deleteAutoRole').setLabel(local.delete).setStyle(ButtonStyle.Danger),
                    new ButtonBuilder().setCustomId('clearAutoRoles').setLabel(local.clearAll).setStyle(ButtonStyle.Secondary),
                    returnButton
                ];

                const menuRoleRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menuRole);
                const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
                const returnRow = new ActionRowBuilder<ButtonBuilder>().addComponents(returnButton);

                if (!dataAutoRoles.length) {
                    embed.setDescription(local.empty);
                }

                await interaction.update({
                    embeds: [embed],
                    components: dataAutoRoles.length ? [menuRoleRow, buttonsRow] : [returnRow]
                });
            }

        } catch (err) {
            await errorLog(err);
        }
    }
}