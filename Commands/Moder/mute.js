const { SlashCommandBuilder, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setNameLocalizations({ ru: 'мут', pl: 'wycisz', uk: 'мут' })
        .setDescription('Mute a user for a certain time')
        .setDescriptionLocalizations({ ru: 'Замутить пользователя на определенное время', pl: 'Wycisz użytkownika na określony czas', uk: 'Замутити користувача на певний час' })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({ ru: 'пользователь', pl: 'użytkownik', uk: 'користувач'})
                .setDescription('The user to mute')
                .setDescriptionLocalizations({ru: 'пользователь, которого хотите замутить', pl: 'użytkownik do wyciszenia', uk: 'користувач, якого хочете замутити'})
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setNameLocalizations({ ru: 'причина', pl: 'powód', uk: 'причина'})
                .setDescription('The reason for the mute')
                .setDescriptionLocalizations({ ru: 'Причина мута', pl: 'Powód wyciszenia', uk: 'Причина муту'})
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setNameLocalizations({ ru: 'длительность', pl: 'czas-trwania', uk: 'тривалість'})
                .setDescription('The duration of the mute in minutes')
                .setDescriptionLocalizations({ ru: 'длительность мута в минутах', pl: 'czas trwania wyciszenia w minutach', uk: 'тривалість муту в хвилинах'})
                .setRequired(true)),
    async execute(interaction) {
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member.permissions.has('ModerateMembers')){
            return interaction.reply({ content: 'You dont have permission to use this command.', ephemeral: true });
        }
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const duration = interaction.options.getInteger('duration');

        // Mute the user
        const memberToMute = interaction.guild.members.cache.get(user.id);
        await memberToMute.timeout(duration * 60 * 1000); // Mute the user for the specified duration

        const embed = {
            color: 65407, // Changed color from '#0099ff' to 65407
            title: 'User Muted',
            thumbnail: {
                url: user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: 'User',
                    value: "```"+user.username+"```",
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
                    name: 'Muted By',
                    value: "```"+interaction.user.username+"```",
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };

        await interaction.reply({ embeds: [embed] });
    },
};