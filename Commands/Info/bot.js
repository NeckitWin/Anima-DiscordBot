const { SlashCommandBuilder } = require("discord.js");

console.log("command Info/bot.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setNameLocalizations({ ru: 'бот', pl: 'bot', uk: 'бот' })
        .setDescription('Shows information about the bot')
        .setDescriptionLocalizations({ ru: 'Показывает информацию о боте', pl: 'Pokazuje informacje o bocie', uk: 'Показує інформацію про бота' }),
    async execute(interaction) {
        const embed = {
            color: 0xd40e3e,
            title: "Info about Animabot",
            thumbnail: {
                url: interaction.client.user.displayAvatarURL(),
            },
            fields: [
                {
                    name: "My name is " + interaction.client.user.username,
                    value: '',
                    inline: true,
                },
                {
                    name: 'My ID',
                    value: "```"+interaction.client.user.id+"```",
                    inline: false,
                },
                {
                    name: "Number of servers",
                    value: "```"+interaction.client.guilds.cache.size+"```",
                    inline: true,
                },
                {
                    name:"Number of users",
                    value: "```"+interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)+"```",
                    inline: true,
                },
                {
                    name: "When I was created",
                    value: "```"+interaction.client.user.createdAt.toLocaleTimeString("pl-PL", { timeZone: "Europe/Warsaw", day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })+"```",
                    inline: true,
                },
                {
                    name: "My developers",
                    nameLocalizations:{
                        ru: 'Мои разработчики',
                        pl: 'Moi programiści',
                        uk: 'Мої розробники'
                    },
                    value: "<@429562004399980546> ([NeckitWin](https://github.com/NeckitWin)) , <@321908057187549185> ([Enisey23](https://github.com/Enisey23))",
                    inline: false,
                },
                {
                    name: "My support server",
                    value: "[Discord Server Link](https://discord.gg/gzYk2gcqAG)",
                    inline: true,
                },
                {
                    name: "Source code",
                    value: "[GitHub Repository](https://github.com/NeckitWin/Anima-DiscordBot)",
                    inline: true,
                },
            ],
        };
        interaction.reply({ embeds: [embed] });
    }
};
