const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Colors} = require("discord.js");



module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setNameLocalizations({ ru: 'бот', pl: 'bot', uk: 'бот' })
        .setDescription('Shows information about the bot')
        .setDescriptionLocalizations({ ru: 'Показывает информацию о боте', pl: 'Pokazuje informacje o bocie', uk: 'Показує інформацію про бота' }),
    async execute(interaction) {
        const bot = await interaction.client.user.fetch();
        const ButtonServer = new ButtonBuilder()
            .setLabel("Discord Server")
            .setURL("https://discord.com/invite/JxNyZAsYpA")
            .setStyle(ButtonStyle.Link);

        const ButtonWebSite = new ButtonBuilder()
            .setLabel("Website")
            .setURL("https://neckitwin.github.io/")
            .setStyle(ButtonStyle.Link);

        const ButtonGitHub = new ButtonBuilder()
            .setLabel("Source Code")
            .setURL("https://github.com/NeckitWin/Anima-DiscordBot")
            .setStyle(ButtonStyle.Link);

        const rowLinksForBot = new ActionRowBuilder()
            .addComponents(ButtonServer, ButtonWebSite, ButtonGitHub);

        const embed = new EmbedBuilder()
            .setColor(Colors.White)
            .setTitle(`Info about Bot ${interaction.client.user.username} 🤖`)
            .setDescription(' ')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setImage(bot.bannerURL({ format: "png", size: 4096}))
            .addFields(
                {
                    name: 'My ID',
                    value: "```js\n"+interaction.client.user.id+"```",
                    inline: false,
                },
                {
                    name: "Number of servers",
                    value: "```"+"🌐"+interaction.client.guilds.cache.size+"```",
                    inline: true,
                },
                {
                    name:"Number of users",
                    value: "```"+"👤"+interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)+"```",
                    inline: true,
                },
                {
                    name: "When I was created",
                    value: "```"+interaction.client.user.createdAt.toLocaleTimeString("pl-PL", { timeZone: "Europe/Warsaw", day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })+"```",
                    inline: true,
                },
                {
                    name: "My owner",
                    value: "<@429562004399980546>[Contact](https://neckitwin.github.io/)",
                    inline: true,
                },
                {
                    name: "My support server",
                    value: "[Discord Server Link](https://discord.gg/rw5dzGT67s)",
                    inline: true,
                },
                {
                    name: "Source code",
                    value: "[GitHub Repository](https://github.com/NeckitWin/Anima-DiscordBot)",
                    inline: true,
                }
            )
        interaction.reply({ embeds: [embed], components: [rowLinksForBot]});
    }
};
