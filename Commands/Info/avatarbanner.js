const { SlashCommandBuilder } = require('@discordjs/builders');

console.log("command Info/avatarbanner.js loaded✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar_banner')
        .setNameLocalizations({ ru: 'аватар_баннер', pl: 'awatar_banner', uk: 'аватар_банер' })
        .setDescription('Shows avatar and banner of a user or of a user that was mentioned)')
        .setDescriptionLocalizations({ ru: 'Показывает аватарку и баннер пользователя', pl: 'Pokazuje awatar i baner użytkownika', uk: 'Показує аватар і банер користувача' })
        .addUserOption(option => option.setName('user').setDescription('Пользователь')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        await user.fetch();
        const guild = interaction.guild;
        const member = await guild.members.fetch(user.id);
        const embed = {
            color: member.roles.highest.color,
            title: `Avatar ${user.username}`,
            image: {
                url: user.avatarURL({ size: 4096 }),
            },
        };
        const embed1 = {
            color: member.roles.highest.color,
            title: `Server avatar ${user.username}`,
            image: {
                url: member.displayAvatarURL({ size: 4096 }),
            },
        };
        const embed2 = {
            color: member.roles.highest.color,
            title: `Banner ${user.username}`,
            image: {
                url: user.bannerURL({ size: 4096 }),
            },
        };
        interaction.reply({ embeds: [embed, embed1, embed2] });
    }
};
