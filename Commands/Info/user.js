const { SlashCommandBuilder } = require("discord.js");

console.log("command Info/user.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Показывает информацию о пользователе или о пользователе, которого упомянули')
        .addUserOption(option => option.setName('user').setDescription('Пользователь, о котором нужна информация')),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            await user.fetch({ force: true });
            const member = interaction.guild.members.cache.get(user.id);

            const embed = {
                color: 0x0099ff,
                title: `Информация о пользователе ${user.username}`,
                thumbnail: {
                    url: user.displayAvatarURL({ dynamic: true }),
                },
                image: {
                    url: user.bannerURL({ dynamic: true, size: 4096 }),
                },
                fields: [
                    { name: 'Имя пользователя', value: user.username, inline: true },
                    { name: 'ID пользователя', value: user.id, inline: false },
                    { name: 'Дата создания аккаунта', value: user.createdAt.toDateString(), inline: true },
                    { name: 'Дата входа на сервер', value: member.joinedAt.toDateString(), inline: true },
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
