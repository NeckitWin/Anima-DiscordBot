const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

console.log("command Info/role.js loaded✅");

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
            const role = interaction.options.getRole('role');
            const embed = new EmbedBuilder()
                .setColor(role.color)
                .setTitle(`Информация о роли ${role.name}`)
                .setThumbnail(role.iconURL({size: 4096}))
                .addFields(
                    {name:'🆔 ID роли', value:"```"+role.id+"```", inline: true},
                    {name:'🌈 Цвет роли', value:"```"+"#"+role.color.toString(16)+"```", inline: false},
                    {name:'📅 Дата создания', value:"```"+role.createdAt.toLocaleString('pl-PL')+"```", inline: true},
                    {name:'👥 Владельцы', value:"```"+role.members.size+"```", inline: true},
                    {name:'👑 Важность роли', value:"```"+(role.guild.roles.cache.size - role.position)+"```", inline: true},
                    {name:'🔒 Разрешения', value:"```"+role.permissions.toArray().join(", ")+"```", inline: false}
                );
            interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error(error);
            interaction.reply('Произошла ошибка при получении информации о роли.');
        }
    }
}