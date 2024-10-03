const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const lang = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setNameLocalizations({ ru: 'бан', pl: 'ban', uk: 'бан' })
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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

        let preferredLang = interaction.guild.preferredLocale;
        if (!lang.hasOwnProperty(preferredLang)) preferredLang = 'en';
        let local = lang[preferredLang].ban;

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
            color: 65407,
            title: local.title,
            thumbnail: {
                url: user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: local.user,
                    value: "```"+user.displayName+"```",
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
                    value: "```"+`${time} ${local.minutes}`+"```",
                    inline: true,
                },
                {
                    name: local.messages,
                    value: deleteMessages ? `\`\`\`${local.yes}\`\`\`` : `\`\`\`${local.no}\`\`\``,
                    inline: true,
                },
                {
                    name: local.by,
                    value: "```"+interaction.user.displayName+"```",
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };

        await interaction.reply({ embeds: [embed] });

        setTimeout(async () => {
            await interaction.guild.members.unban(user, local.unban);
        }, time * 60 * 1000);
    },
};