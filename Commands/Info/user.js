const { SlashCommandBuilder } = require("discord.js");
const {getUserServer} = require('../../Data/funcs/db')
const {formatDate} = require("../../Data/utility");
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setNameLocalizations({ ru: 'пользователь', pl: 'użytkownik', uk: 'користувач' })
        .setDescription('Shows information about a user or about a user that was mentioned')
        .setDescriptionLocalizations({ru: "Показывает информацию о пользователе или о пользователе, которого упомянули", pl: "Pokazuje informacje o użytkowniku lub o użytkowniku, którego wspomniano", uk: "Показує інформацію про користувача або про користувача, якого згадали"})
        .addUserOption(option => option
            .setName('user')
            .setNameLocalizations({
                ru: "пользователь",
                pl: "użytkownik",
                uk: "користувач"
            })
            .setDescription('Select a participant to display information'))
        .setDescriptionLocalizations({
            ru: "Выберите участника для отображения информации",
            pl: "Wybierz uczestnika, aby wyświetlić informacje",
            uk: "Виберіть учасника для відображення інформації"
        }),
    async execute(interaction) {
        const lang = await getLang(interaction);
        const local = lang.user;
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            await user.fetch();
            const member = interaction.guild.members.cache.get(user.id);

            const getUserArray = await getUserServer(user.id, interaction.guild.id);
            const userInfo = getUserArray[0] || {};
            let aura = userInfo.aura ?? 0;

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
                    { name: `👤 ${local.username}`, value: "```"+user.username+"```", inline: true },
                    { name: `🔢 ${local.userid}`, value: "```"+user.id+"```", inline: false },
                    { name: `📅 ${local.date}`, value: "```"+formatDate(user.createdAt)+"```", inline: true },
                    { name: `📅 ${local.dateentry}`, value: "```"+formatDate(member.joinedAt)+"```", inline: true },
                    { name: '🔥 Aura', value: `\`\`\`ansi\n[2;31m${aura}[0m\`\`\``, inline: true },
                    { name: `🔒 ${local.roles}`, value: member.roles.cache.map(role => role.toString()).join(' '), inline: false },
                ],
            };
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: local.error, ephemeral: true });
        }
    },
};