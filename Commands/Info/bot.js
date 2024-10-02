const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Colors} = require("discord.js");
const {formatDate} = require("../../Data/utility");
const lang = require("../../Data/Lang");

const ButtonServer = new ButtonBuilder()
    .setLabel("Discord Server")
    .setURL("https://discord.gg/rw5dzGT67s")
    .setStyle(ButtonStyle.Link);

const ButtonGitHub = new ButtonBuilder()
    .setLabel("Github")
    .setURL("https://github.com/NeckitWin")
    .setStyle(ButtonStyle.Link);

const rowLinksForBot = new ActionRowBuilder()
    .addComponents(ButtonServer, ButtonGitHub);

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
        let preferredLang = interaction.guild.preferredLocale;
        if (!lang.hasOwnProperty(preferredLang)) preferredLang = 'en';
        let local = lang[preferredLang].bot;

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
            )
        interaction.reply({embeds: [embed], components: [rowLinksForBot]});
    }
};
