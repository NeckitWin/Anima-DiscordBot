const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Colors} = require("discord.js");
const {formatDate} = require("../../Data/utility");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`bot`)
        .setNameLocalizations({ru: 'бот', pl: 'bot', uk: 'бот'})
        .setDescription('Shows information about the bot')
        .setDescriptionLocalizations({
            ru: 'Показывает информацию о боте',
            pl: 'Pokazuje informacje o bocie',
            uk: 'Показує інформацію про бота'
        }),
    async execute(interaction) {

        const bot = await interaction.client.user.fetch();
        const ButtonServer = new ButtonBuilder()
            .setLabel("Discord Server")
            .setURL("https://discord.gg/rw5dzGT67s")
            .setStyle(ButtonStyle.Link);

        const ButtonWebSite = new ButtonBuilder()
            .setLabel("Website")
            .setURL("https://github.com/NeckitWin")
            .setStyle(ButtonStyle.Link);

        const ButtonGitHub = new ButtonBuilder()
            .setLabel("Source Code")
            .setURL("https://github.com/NeckitWin")
            .setStyle(ButtonStyle.Link);

        const rowLinksForBot = new ActionRowBuilder()
            .addComponents(ButtonServer, ButtonWebSite, ButtonGitHub);

        const embed = new EmbedBuilder()
            .setColor(Colors.White)
            .setTitle(`Info about Bot ${interaction.client.user.username} 🤖`)
            .setDescription(' ')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setImage(bot.bannerURL({format: "png", size: 4096}))
            .addFields(
                {
                    name: 'My ID',
                    value: `\`\`\`fix\n${interaction.client.user.id}\`\`\``,
                    inline: false,
                },
                {
                    name: "Lib",
                    value: `\`\`\`css\nDiscord.js\`\`\``,
                    inline: true,
                },
                {
                    name: "When I was created",
                    value: `\`\`\`${formatDate(interaction.client.user.createdAt)}\`\`\``,
                    inline: true,
                },
                {
                    name: "My owner",
                    value: "NeckitWin <@429562004399980546>",
                    inline: false,
                },
                {
                    name: "Number of servers",
                    value: `\`\`\`🌐${interaction.client.guilds.cache.size}\`\`\``,
                    inline: true,
                },
                {
                    name: "Number of users",
                    value: `\`\`\`👤${interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\`\`\``,
                    inline: true,
                }
            )
        interaction.reply({embeds: [embed], components: [rowLinksForBot]});
    }
};
