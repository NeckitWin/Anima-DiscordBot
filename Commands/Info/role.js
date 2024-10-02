const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {formatDate} = require("../../Data/utility");
const lang = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Shows information about the role')
        .setNameLocalizations({ru: 'роль', pl: 'rola', uk: 'роль'})
        .setDescriptionLocalizations({
            ru: 'Показывает информацию о роли',
            pl: 'Pokazuje informacje o roli',
            uk: 'Показує інформацію про роль'
        })
        .addRoleOption(option => option
            .setName('role')
            .setNameLocalizations({ru: 'роль', pl: 'rola', uk: 'роль'})
            .setDescription('Role to get information about')
            .setDescriptionLocalizations({
                ru: 'Роль, о которой нужно получить информацию',
                pl: 'Rola, o której chcesz uzyskać informacje',
                uk: 'Роль, про яку потрібно отримати інформацію'
            })
            .setRequired(true)),
    async execute(interaction) {
        try {
            let preferredLang = interaction.guild.preferredLocale;
            if (!lang.hasOwnProperty(preferredLang)) preferredLang = 'en';
            let local = lang[preferredLang].role;

            const role = interaction.options.getRole('role');
            const embed = new EmbedBuilder()
                .setColor(role.color)
                .setTitle(`${local.title}: ${role.name}`)
                .setThumbnail(role.iconURL({size: 4096}))
                .addFields(
                    {name:`🆔 ${local.roleid}`, value:"```fix\n"+role.id+"```", inline: true},
                    {name:`🌈 ${local.color}`, value:"```"+"#"+role.color.toString(16)+"```", inline: false},
                    {name:`📅 ${local.date}`, value:"```"+formatDate(role.createdAt)+"```", inline: true},
                    {name:`👥 ${local.owners}`, value:"```"+role.members.size+"```", inline: true},
                    {name:`👑 ${local.position}`, value:"```"+(role.guild.roles.cache.size - role.position)+"```", inline: true},
                    {name:`🔒 ${local.permissions}`, value:"```"+role.permissions.toArray().join(", ")+"```", inline: false}
                );
            interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error(error);
            interaction.reply('Error.', {ephemeral: true});
        }
    }
}