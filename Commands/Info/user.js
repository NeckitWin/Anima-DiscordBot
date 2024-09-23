const { SlashCommandBuilder } = require("discord.js");
const {getUser} = require('../../Data/db')

console.log("command Info/user.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setNameLocalizations({ ru: 'пользователь', pl: 'użytkownik', uk: 'користувач' })
        .setDescription('Shows information about a user or about a user that was mentioned')
        .setDescriptionLocalizations({ru: "Показывает информацию о пользователе или о пользователе, которого упомянули", pl: "Pokazuje informacje o użytkowniku lub o użytkowniku, którego wspomniano", uk: "Показує інформацію про користувача або про користувача, якого згадали"})
        .addUserOption(option => option.setName('user').setDescription('Пользователь, о котором нужна информация')),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            await user.fetch();
            const member = interaction.guild.members.cache.get(user.id);

            const getUserArray = await getUser(user.id, interaction.guild.id);
            const userInfo = getUserArray[0];

            const formatDate = (date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            };

            const embed = {
                color: 0x0099ff,
                title: `Info about user — ${user.displayName}`,
                thumbnail: {
                    url: user.displayAvatarURL(),
                },
                image: {
                    url: user.bannerURL({ size: 4096 }),
                },
                fields: [
                    { name: '👤 Username', value: "```"+user.username+"```", inline: true },
                    { name: '🔢 User ID', value: "```"+user.id+"```", inline: false },
                    { name: '📅 Date of creation', value: "```"+formatDate(user.createdAt)+"```", inline: true },
                    { name: '📅 Server entry date', value: "```"+formatDate(member.joinedAt)+"```", inline: true },
                    { name: '🔥 Aura', value: `\`\`\`ansi\n[2;31m${userInfo.aura}[0m\`\`\``, inline: true },
                    { name: '🔒 Roles', value: member.roles.cache.map(role => role.toString()).join(' '), inline: false },
                ],
            };
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    },
};