const { SlashCommandBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setNameLocalizations({ ru: 'бан', pl: 'ban', uk: 'бан' })
        .setDescription('Ban a user with a reason and for a certain time')
        .setDescriptionLocalizations({ ru: 'Забанить пользователя с причиной и на определенное время', pl: 'Zbanuj użytkownika z powodem i na określony czas', uk: 'Забанувати користувача з причиною і на певний час' })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({ ru: 'пользователь', pl: 'użytkownik', uk: 'користувач'})
                .setDescription('The user to ban')
                .setDescriptionLocalizations({ru: 'пользователь, которого хотите забанить', pl: 'użytkownik do zbanowania', uk: 'користувач, якого хочете забанити'})
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setNameLocalizations({ ru: 'причина', pl: 'przyczyna', uk: 'причина'})
                .setDescription('The reason for the ban')
                .setDescriptionLocalizations({ ru: 'причина бана', pl: 'powód zbanowania', uk: 'причина бану'})
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('time')
                .setNameLocalizations({ ru: 'время', pl: 'czas', uk: 'час'})
                .setDescription('In minutes')
                .setDescriptionLocalizations({ ru: 'время в минутах', pl: 'czas w minutach', uk: 'час в хвилинах'})
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('delete-messages')
                .setNameLocalizations({ ru: 'удалить-сообщения', pl: 'usunąć-wiadomości', uk: 'видалити-повідомлення'})
                .setDescription('Whether to delete the user\'s messages')
                .setDescriptionLocalizations({ ru: 'удалить сообщения пользователя', pl: 'czy usunąć wiadomości użytkownika', uk: 'видалити повідомлення користувача'})
                .setRequired(true)),
    async execute(interaction) {
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member.permissions.has('BanMembers')){
            return interaction.reply({ content: 'You dont have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const time = interaction.options.getInteger('time');
        const deleteMessages = interaction.options.getBoolean('delete_messages');

        await interaction.guild.members.ban(user, { reason });

        if (deleteMessages) {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(message => message.author.id === user.id);
            await interaction.channel.bulkDelete(userMessages);
        }

        const embed = {
            color: 65407, // Changed color from '#0099ff' to 65407
            title: 'User Banned',
            thumbnail: {
                url: user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: 'User',
                    value: "```"+user.name+"```",
                    inline: true,
                },
                {
                    name: 'User ID',
                    value: "```"+user.id+"```",
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: "```"+reason+"```",
                    inline: true,
                },
                {
                    name: 'Duration',
                    value: "```"+`${time} minutes`+"```",
                    inline: true,
                },
                {
                    name: 'Messages Deleted',
                    value: deleteMessages ? "```Yes```" : "```No```",
                    inline: true,
                },
                {
                    name: 'Banned By',
                    value: "```"+interaction.user.name+"```",
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };

        await interaction.reply({ embeds: [embed] });

        setTimeout(async () => {
            await interaction.guild.members.unban(user, 'Temporary ban duration expired');
        }, time * 60 * 1000);
    },
};