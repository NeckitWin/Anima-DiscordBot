const { SlashCommandBuilder, MessageEmbed, PermissionFlagsBits } = require('discord.js');
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setNameLocalizations({ ru: 'мут', pl: 'wycisz', uk: 'мут' })
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
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

        const lang = await getLang(interaction);
        const local = lang.mute;

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const duration = interaction.options.getInteger('duration');

        const memberToMute = interaction.guild.members.cache.get(user.id);
        await memberToMute.timeout(duration * 60 * 1000);

        const embed = {
            color: 65407,
            title: local.title,
            thumbnail: {
                url: user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: local.user,
                    value: "```"+user.username+"```",
                    inline: true,
                },
                {
                    name: local.userid,
                    value: "```"+user.id+"```",
                    inline: true,
                },
                {
                    name: local.reason,
                    value: "```"+reason+"```",
                    inline: true,
                },
                {
                    name: local.duration,
                    value: "```"+`${duration} ${local.minutes}`+"```",
                    inline: true,
                },
                {
                    name: local.by,
                    value: "```"+interaction.user.username+"```",
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };

        await interaction.reply({ embeds: [embed] });
    },
};