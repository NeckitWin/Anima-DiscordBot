const { SlashCommandBuilder } = require("discord.js");

console.log("command Info/user.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setNameLocalizations({ ru: 'пользователь', pl: 'użytkownik', uk: 'користувач' })
        .setDescription('Shows information about a user or about a user that was mentioned')
        .setDescriptionLocalizations({ru: "Показывает информацию о пользователе или о пользователе, которого упомянули", pl: "Pokazuje informacje o użytkowniku lub o użytkowniku, którego wspomniano", uk: "Показує інформацію про користувача або про користувача, якого згадали"})
        .addUserOption(option => option.setName('user').setDescription('Пользователь, о котором нужна информация')),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            await user.fetch();
            const member = interaction.guild.members.cache.get(user.id);

            const embed = {
                color: 0x0099ff,
                title: `Информация о пользователе ${user.username}`,
                thumbnail: {
                    url: user.displayAvatarURL(),
                },
                image: {
                    url: user.bannerURL({ size: 4096 }),
                },
                fields: [
                    { name: 'Имя пользователя', value: "```"+user.username+"```", inline: true },
                    { name: 'ID пользователя', value: "```"+user.id+"```", inline: false },
                    { name: 'Дата создания', value: "```"+user.createdAt.toDateString()+"```", inline: true },
                    { name: 'Дата входа на сервер', value: "```"+member.joinedAt.toDateString()+"```", inline: true },
                    { name: 'Роли', value: member.roles.cache.map(role => role.toString()).join(' '), inline: false },
                ],
            };

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('Произошла ошибка при получении информации о пользователе.');
        }
    },
};
