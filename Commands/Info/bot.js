const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Colors} = require("discord.js");
const {formatDate} = require("../../Data/utility");
const {getLang} = require("../../Data/Lang");


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
        const lang = await getLang(interaction);
        const local = lang.bot;

        const bot = await interaction.client.user.fetch();

        const embed = new EmbedBuilder()
            .setColor(Colors.White)
            .setTitle(`${local.title} - ${interaction.client.user.username} 🤖`)
            .setDescription(' ')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setImage(bot.bannerURL({format: "png", size: 4096}))
            .addFields(
                {
                    name: local.botid,
                    value: `\`\`\`fix\n${interaction.client.user.id}\`\`\``,
                    inline: false,
                },
                {
                    name: local.lib,
                    value: `\`\`\`css\nDiscord.js\`\`\``,
                    inline: true,
                },
                {
                    name: local.date,
                    value: `\`\`\`${formatDate(interaction.client.user.createdAt)}\`\`\``,
                    inline: true,
                },
                {
                    name: local.owner,
                    value: "NeckitWin <@429562004399980546>",
                    inline: false,
                },
                {
                    name: local.servers,
                    value: `\`\`\`🌐${interaction.client.guilds.cache.size}\`\`\``,
                    inline: true,
                },
                {
                    name: local.users,
                    value: `\`\`\`👤${interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\`\`\``,
                    inline: true,
                }
            );

        const ButtonServer = new ButtonBuilder()
            .setLabel(local.discordserver)
            .setURL("https://discord.gg/d8kCF4c3t5")
            .setStyle(ButtonStyle.Link);

        const ButtonWebsite = new ButtonBuilder()
            .setLabel(local.website)
            .setURL("https://neckitwin.github.io/Anima/")
            .setStyle(ButtonStyle.Link);

        const ButtonGitHub = new ButtonBuilder()
            .setLabel(local.invite)
            .setURL("https://discord.com/oauth2/authorize?client_id=1187466797885182141")
            .setStyle(ButtonStyle.Link);

        const rowLinksForBot = new ActionRowBuilder()
            .addComponents(ButtonServer, ButtonWebsite , ButtonGitHub);

        interaction.reply({embeds: [embed], components: [rowLinksForBot]});
    }
};
