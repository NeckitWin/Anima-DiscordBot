const {SlashCommandBuilder, PermissionFlagsBits, RoleSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder} = require('discord.js');
const {getLang} = require("../../Data/Lang");

const commandName = 'autoroles';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setNameLocalizations({ru: 'автороли', pl: 'autorole', uk: 'авторолі'})
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
            const {guild} = interaction;
            if (!guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});

            const embed = new EmbedBuilder()
                .setTitle('Авто роли')
                .setColor('#00ff00')
                .setDescription(`Добаляйте и редактируйте автоматические роли для новых участников`);

            const menuRole = new RoleSelectMenuBuilder()
                .setCustomId('autoRolesMenu')
                .setPlaceholder('Выберите роль');

            const buttonAdd = new ButtonBuilder()
                .setCustomId('addAutoRole')
                .setLabel('Добавить роль')
                .setStyle('Success');

            const buttonEdit = new ButtonBuilder()
                .setCustomId('editAutoRole')
                .setLabel('Редактировать авто роли')
                .setStyle('Secondary');

            const rowRoleMenu = new ActionRowBuilder()
                .addComponents(menuRole);

            const rowButtons = new ActionRowBuilder()
                .addComponents(buttonAdd, buttonEdit);

            await interaction.reply({embeds: [embed], components: [rowRoleMenu, rowButtons]});


        } catch (err) {
            console.error(err);
        }
    }
}