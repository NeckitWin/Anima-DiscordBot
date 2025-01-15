const {Events, RoleSelectMenuBuilder, ActionRowBuilder, EmbedBuilder} = require(`discord.js`);
const {getLang} = require("../Data/Lang");
const {updateGreet} = require("../Data/funcs/dbGreet");
const {commandLog} = require("../Data/funcs/commandLog");
const {postAutoRole, getAutoRoles} = require("../Data/funcs/dbAutoRoles");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (!(interaction.isButton() || interaction.isRoleSelectMenu())) return;
            const customIds = ['addAutoRole', 'editAutoRole', 'autoRolesMenu'];
            if (!customIds.includes(interaction.customId)) return;
            const lang = await getLang(interaction);
            if (interaction.user.id !== interaction.message.interaction.user.id) return await interaction.reply({content: lang.error.notforyou, ephemeral: true});
            if(!commandLog("autoRolesDataHandler", interaction, 1)) return;
            const {message, values, guild, customId} = interaction;
            const getRoleFromMenu = message.components[0].components[0].data.default_values[0];
            const roleId = getRoleFromMenu.id;

            if (customId === 'autoRolesMenu') {
                const menuRole = new RoleSelectMenuBuilder()
                    .setCustomId('autoRolesMenu')
                    .setPlaceholder('Select roles')
                    .addDefaultRoles(values[0]);

                const rowRoleMenu = new ActionRowBuilder()
                    .addComponents(menuRole);

                const getRowButtons = message.components[1];

                await interaction.update({components: [rowRoleMenu, getRowButtons]})
            } else if (customId === 'addAutoRole') {
                const isSetAutoRole = await postAutoRole(guild.id, roleId);
                if (!isSetAutoRole) return await interaction.reply({content: "Эта роль уже установлена", ephemeral: true});
                await interaction.reply({content: `Роль <@&${roleId}> успешно добавлена`, ephemeral: true});
            } else if (customId === 'editAutoRole') {
                // doesn't work

                const dataAutoRoles = await getAutoRoles(guild.id);
                const getFirstRole = dataAutoRoles[0].roleID;
                const menuRole = new RoleSelectMenuBuilder()
                    .setCustomId('editRolesMenu')
                    .setPlaceholder('Выбери роли')
                    .addDefaultRoles([getFirstRole]);

                await interaction.update({components: [menuRole]});

            }

        } catch (err) {
            console.error(err);
        }
    }
}