const {SlashCommandBuilder} = require("discord.js");

console.log("user.js загружен✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Показывает информацию о пользователе или о пользователе, которого упомянули')
        .addUserOption(option => option.setName('user').setDescription('Пользователь, о котором нужна информация')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const embed = {
            color: 0x0099ff,
            title: `Информация о пользователе ${user.username}`,
            thumbnail: {
                url: user.displayAvatarURL({dynamic: true}),
            },
            fields: [
                {
                    name: 'Имя пользователя',
                    value: user.username,
                    inline: true,
                },
                {
                    name: 'Тег пользователя',
                    value: user.tag,
                    inline: true,
                },
                {
                    name: 'ID пользователя',
                    value: user.id,
                    inline: true,
                },
                {
                    name: 'Дата создания аккаунта',
                    value: user.createdAt,
                    inline: true,
                },
                {
                    name: 'Дата входа на сервер',
                    value: member.joinedAt,
                    inline: true,
                },
                {
                    name: 'Высшая роль',
                    value: member.roles.highest,
                    inline: true,
                },
            ],
        }
    }
};