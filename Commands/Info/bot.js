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
        try {

            const lang = await getLang(interaction);
            const local = lang.bot;
            const bot = await interaction.client.user.fetch();
            const lib = `discord.js`;
            const botCreated = formatDate(interaction.client.user.createdAt);
            const serversCount = interaction.client.guilds.cache.size;
            const usersCount = interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
            const supportServer = `https://discord.gg/d8kCF4c3t5`;
            const botAvatar = bot.displayAvatarURL({dynamic: true});
            const botBanner = bot.bannerURL({dynamic: true, size: 4096});
            const botOwnerID = `429562004399980546`;
            const botOwner = await interaction.client.users.fetch(botOwnerID);
            const titleEmoji = `<a:anime_girl:1294060303734280244>`;
            const nodejsEmoji = `<:node_js:1294063653666160693>`;

            const embed = new EmbedBuilder()
                .setTitle(`${titleEmoji} ${local.title} - Anima!`)
                .setDescription(
                    `**${local.description}**\n\n` +
                    `**${local.lib}:**  \`${lib}\`${nodejsEmoji}\n`
                )
                .setColor(`#ff6a92`)
                .setThumbnail(botAvatar)
                .setImage(botBanner)
                .addFields(
                    {name: `📅 ${local.create}`, value: `╰ **\`${botCreated}\`**`, inline: false},
                    {name: `❤️‍🔥 ${local.use}`, value: `╰ **\`${serversCount}\`** ${local.servers}`, inline: false},
                    {name: `👥 ${local.help}`, value: `╰ **\`${usersCount}\`** ${local.users}`, inline: false}
                )
                .setFooter({iconURL: botOwner.displayAvatarURL(), text: `${botOwner.username} - ${local.dev}⚙️`});


            // buttons
            const ButtonServer = new ButtonBuilder()
                .setLabel(local.discordserver)
                .setURL(supportServer)
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
                .addComponents(ButtonServer, ButtonWebsite, ButtonGitHub);

            await interaction.reply({embeds: [embed], components: [rowLinksForBot]});
        } catch (e) {
            console.error(e);
        }
    }
};
