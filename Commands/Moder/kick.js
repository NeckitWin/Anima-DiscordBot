const {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField} = require('discord.js');
const {getLang} = require("../../Data/Lang");

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
        const lang = await getLang(interaction);
        const local = lang.kick;
        try {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({content: lang.error.botdontpermkick, ephemeral: true});
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            const memberToKick = interaction.guild.members.cache.get(user.id);
            const memberExecuting = interaction.guild.members.cache.get(interaction.user.id);

            if (!memberToKick) return await interaction.reply({content: lang.user.error, ephemeral: true});

            if (memberToKick.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
                return interaction.reply({ content: lang.error.bothigherrole, ephemeral: true });
            }

            if (memberToKick.roles.highest.position > memberExecuting.roles.highest.position) {
                return interaction.reply({ content: lang.error.userhigherrole, ephemeral: true });
            }

            if (memberToKick.roles.highest.position === memberExecuting.roles.highest.position) {
                return interaction.reply({ content: lang.error.rolesEqual, ephemeral: true });
            }

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
        } catch (err) {
            console.error(err);
            return interaction.reply({content: lang.user.error, ephemeral: true});
        }
    }
}