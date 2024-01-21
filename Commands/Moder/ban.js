const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setNameLocalizations({ ru: 'бан', pl: 'ban', uk: 'бан' })
        .setDescription('Ban a user with a reason and for a certain time')
        .setDescriptionLocalizations({ ru: 'Забанить пользователя с причиной и на определенное время', pl: 'Zbanuj użytkownika z powodem i na określony czas', uk: 'Забанувати користувача з причиною і на певний час' })
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('The duration of the ban in minutes')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('delete_messages')
                .setDescription('Whether to delete the user\'s messages')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const duration = interaction.options.getInteger('duration');
        const deleteMessages = interaction.options.getBoolean('delete_messages');

        // Ban the user
        await interaction.guild.members.ban(user, { reason });

        // Delete the user's messages if the option is true
        if (deleteMessages) {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(message => message.author.id === user.id);
            await interaction.channel.bulkDelete(userMessages);
        }

        // Create an embed message
        const embed = {
            color: 65407, // Changed color from '#0099ff' to 65407
            title: 'User Banned',
            thumbnail: {
                url: user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: 'User',
                    value: user.tag,
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
                    value: "```"+`${duration} minutes`+"```",
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

        // Send a reply
        await interaction.reply({ embeds: [embed] });

        // Unban the user after the duration
        setTimeout(async () => {
            await interaction.guild.members.unban(user, 'Temporary ban duration expired');
        }, duration * 60 * 1000); // Convert duration from minutes to milliseconds
    },
};