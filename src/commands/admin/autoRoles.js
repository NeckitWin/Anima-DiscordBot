import { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, RoleSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import { getLang } from "../../utils/lang.ts";
import errorLog from "../../utils/errorLog.ts";
export default {
    data: new SlashCommandBuilder()
        .setName('autoroles')
        .setNameLocalizations({ ru: 'автороли', pl: 'autorole', uk: 'авторолі' })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDescription('Setting up autoroles for new members')
        .setDescriptionLocalizations({
        ru: 'Настройка авторолей для новых участников',
        pl: 'Konfiguracja autoroli dla nowych członków',
        uk: 'Налаштування авторолей для нових учасників'
    }),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const local = lang.autoroles;
            const { guild, channel } = interaction;
            if (!guild)
                return await interaction.reply({ content: lang.error.notguild, ephemeral: true });
            if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ManageRoles))
                return await interaction.reply({
                    content: lang.error.botdontpermrole,
                    ephemeral: true
                });
            const embed = new EmbedBuilder()
                .setTitle(local.title)
                .setColor('#00ff00')
                .setDescription(local.addandedit);
            const menuRole = new RoleSelectMenuBuilder()
                .setCustomId('autoRolesMenu')
                .setPlaceholder(local.select);
            const buttonAdd = new ButtonBuilder()
                .setCustomId('addAutoRole')
                .setLabel(local.add)
                .setStyle('Success');
            const buttonEdit = new ButtonBuilder()
                .setCustomId('editAutoRole')
                .setLabel(local.edit)
                .setStyle('Secondary');
            const rowRoleMenu = new ActionRowBuilder()
                .addComponents(menuRole);
            const rowButtons = new ActionRowBuilder()
                .addComponents(buttonAdd, buttonEdit);
            await interaction.reply({ embeds: [embed], components: [rowRoleMenu, rowButtons] });
        }
        catch (err) {
            await errorLog(err);
        }
    }
};
