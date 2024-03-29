const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

console.log("command Info/avatarbanner.js loaded✅")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar-banner')
        .setNameLocalizations({ ru: 'аватар-баннер', pl: 'awatar-banner', uk: 'аватар-банер' })
        .setDescription('Shows avatar and banner of a user or of a user that was mentioned)')
        .setDescriptionLocalizations({ ru: 'Показывает аватарку и баннер пользователя', pl: 'Pokazuje awatar i baner użytkownika', uk: 'Показує аватар і банер користувача' })
        .addUserOption(option => option
            .setName('user')
            .setNameLocalizations({ ru: 'пользователь', pl: 'użytkownik', uk: 'користувач' })
            .setDescription('User to get avatar and banner of')
            .setDescriptionLocalizations({ ru: 'Пользователь, у которого нужно получить аватар и баннер', pl: 'Użytkownik, którego awatar i baner chcesz uzyskać', uk: 'Користувач, у якого потрібно отримати аватар і банер' })
        ),
    async execute(interaction) {
        const userLink = interaction.options.getUser('user') || interaction.user;
        await userLink.fetch();

        const avatarURL = userLink.avatarURL({ dynamic: true, size: 4096 });
        const serverAvatarURL = interaction.guild.members.cache.get(userLink.id).avatarURL({dynamic: true, size: 4096});
        const bannerURL = userLink.bannerURL({dynamic: true, size: 4096});

        const embed = new EmbedBuilder()
            .setTitle("User Avatars")
            .setDescription("Avatar")
            .setColor("#ff0062")
            .setImage(avatarURL);

        let embeds = [embed];

        if (serverAvatarURL !== null) {
            const embed1 = new EmbedBuilder()
                .setTitle(" ")
                .setDescription("Display server avatar")
                .setColor("#ff0062")
                .setImage(serverAvatarURL);
            embeds.push(embed1);
        }

        if (bannerURL !== null) {
            const embed2 = new EmbedBuilder()
                .setTitle(" ")
                .setDescription("Banner")
                .setColor("#ff0062")
                .setTimestamp()
                .setImage(bannerURL);
            embeds.push(embed2);
        }
        interaction.reply({embeds: embeds});
    }
}
