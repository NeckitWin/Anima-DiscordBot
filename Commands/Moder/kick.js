const {SlashCommandBuilder, MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setNameLocalizations({ru: 'кик', pl: 'wyrzuć', uk: 'кик'})
        .setDescription('Kick a user')
        .setDescriptionLocalizations({ru: 'Кикнуть пользователя', pl: 'Wyrzuć użytkownika', uk: 'Кікнути користувача'})
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({ru: 'пользователь', pl: 'użytkownik', uk: 'користувач'})
                .setDescription('The user to kick')
                .setDescriptionLocalizations({
                    ru: 'Пользователь, которого хотите кикнуть',
                    pl: 'Użytkownik do wyrzucenia',
                    uk: 'Користувач, якого хочете кікнути'
                })
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setNameLocalizations({ru: 'причина', pl: 'powód', uk: 'причина'})
                .setDescription('The reason for the kick')
                .setDescriptionLocalizations({ru: 'Причина кика', pl: 'Powód wyrzucenia', uk: 'Причина кіка'})
                .setRequired(true)),
    async execute(interaction) {
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member.permissions.has('ModerateMembers')) {
            return interaction.reply({content: 'You dont have permission to use this command.', ephemeral: true});
        }
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const memberToKick = interaction.guild.members.cache.get(user.id);
        await memberToKick.kick(reason);

        const embed = {
            color: 16711680,
            title: 'User Kicked',
            thumbnail: {
                url: user.displayAvatarURL({dynamic: true}),
            },
            fields: [
                {
                    name: 'User',
                    value: "```" + user.username + "```",
                    inline: true,
                },
                {
                    name: 'User ID',
                    value: "```" + user.id + "```",
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: "```" + reason + "```",
                },
            ],
            timestamp: new Date(),
        };

        return interaction.reply({embeds: [embed]});
    }
}