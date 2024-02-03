const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setNameLocalizations({ ru: 'мут', pl: 'wycisz', uk: 'мут' })
        .setDescription('Mute a user with a reason and for a certain time')
        .setDescriptionLocalizations({ ru: 'Замутить пользователя с причиной и на определенное время', pl: 'Wycisz użytkownika z powodem i na określony czas', uk: 'Замутити користувача з причиною і на певний час' })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({ ru: 'пользователь', pl: 'użytkownik', uk: 'користувач'})
                .setDescription('The user to mute')
                .setDescriptionLocalizations({ru: 'пользователь, которого хотите замутить', pl: 'użytkownik do wyciszenia', uk: 'користувач, якого хочете замутити'})
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setNameLocalizations({ ru: 'причина', pl: 'przyczyna', uk: 'причина'})
                .setDescription('The reason for the mute')
                .setDescriptionLocalizations({ ru: 'причина мута', pl: 'powód wyciszenia', uk: 'причина муту'})
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setNameLocalizations({ ru: 'длительность', pl: 'czas-trwania', uk: 'тривалість'})
                .setDescription('The duration of the mute in minutes')
                .setDescriptionLocalizations({ ru: 'длительность мута в минутах', pl: 'czas trwania wyciszenia w minutach', uk: 'тривалість муту в хвилинах'})
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const duration = interaction.options.getInteger('duration');

        // Mute the user
        const member = interaction.guild.members.cache.get(user.id);
        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            return interaction.reply('Role "Muted" does not exist. Please create it and try again.');
        }
        await member.voice.setChannel(null, reason); // Move the user out of their current voice channel

        // Create an embed message
        const embed = {
            color: 65407, // Changed color from '#0099ff' to 65407
            title: 'User Muted',
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
                    name: 'Muted By',
                    value: "```"+interaction.user.name+"```",
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };

        // Send a reply
        await interaction.reply({ embeds: [embed] });

        // Unmute the user after the duration
        setTimeout(async () => {
            if (!member.voice.channel) {
                await member.voice.setChannel(muteRole, 'Temporary mute duration expired');
            }
        }, duration * 60 * 1000); // Convert duration from minutes to milliseconds
    },
};