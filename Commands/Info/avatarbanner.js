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
        const user = interaction.options.getUser('user') || interaction.user;
        await user.fetch();

        const embed = new EmbedBuilder()
            .setTitle("User Avatars")
            .setDescription(" ")
            .setColor("#ff0062")
            .setImage(user.avatarURL({ dynamic: true, size: 4096 }));
        const embed1 = new EmbedBuilder()
            .setTitle(" ")
            .setDescription(" ")
            .setColor("#ff0062")
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));
        const embed2 = new EmbedBuilder()
            .setTitle("Banner")
            .setDescription(" ")
            .setColor("#ff0062")
            .setTimestamp()
            .setImage(user.bannerURL({ dynamic: true, size: 4096 }));

        interaction.reply({ embeds: [embed, embed1, embed2] });
    }
}
