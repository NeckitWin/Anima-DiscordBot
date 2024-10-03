const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const lang = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setNameLocalizations({ru: 'кик', pl: 'wyrzuć', uk: 'кик'})
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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
        let preferredLang = interaction.guild.preferredLocale;
        if (!lang.hasOwnProperty(preferredLang)) preferredLang = 'en';
        let local = lang[preferredLang].kick;

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const memberToKick = interaction.guild.members.cache.get(user.id);
        await memberToKick.kick(reason);

        const embed = {
            color: 16711680,
            title: `${local.title}`,
            thumbnail: {
                url: user.displayAvatarURL({dynamic: true}),
            },
            fields: [
                {
                    name: local.user,
                    value: "```" + user.username + "```",
                    inline: true,
                },
                {
                    name: local.userid,
                    value: "```" + user.id + "```",
                    inline: true,
                },
                {
                    name: local.reason,
                    value: "```" + reason + "```",
                },
            ],
            timestamp: new Date(),
        };

        return interaction.reply({embeds: [embed]});
    }
}