const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {formatDate} = require("../../Data/utility");
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setNameLocalizations({ru: 'сервер', pl: 'serwer', uk: 'сервер'})
        .setDescription('Shows information about the server')
        .setDescriptionLocalizations({
            ru: "Показывает информацию о сервере",
            pl: "Pokazuje informacje o serwerze",
            uk: "Показує інформацію про сервер"
        }),
    async execute(interaction) {
        const lang = await getLang(interaction);
        const local = lang.server;

        const guild = interaction.guild;
        // await guild.channels.fetch();
        const owner = await guild.fetchOwner();
        const serverIcon = guild.iconURL();
        const serverBanner = guild.bannerURL();
        const members = await guild.members.fetch();
        const channels = await guild.channels.fetch();
        console.log(channels)

        const embed = new EmbedBuilder()
            .setTitle(`${local.title} ${guild.name}`)
            .setColor(`#ff5890`)
            .setAuthor({name: owner.user.displayName, iconURL: owner.user.avatarURL()})
            .setDescription(`${local.owner} \`${owner.user.username}\`\n` +
                `${local.serverid} \`${guild.id}\`\n`)
            .addFields(
                {
                    name: `members`,
                    value: `all: ${members.size}\n` +
                        `people: ${members.filter(member => !member.user.bot).size}\n` +
                        `bots: ${members.filter(member => member.user.bot).size}`,
                    inline: true
                },
                {
                    name: `channels`,
                    value: `all: ${channels.size}\n` +
                        `text: ${channels.filter(channel => channel.type).size}\n` +
                        `forum: ${channels.filter(channel => channel.type === 'GuildForum').size}\n` +
                        `voice: ${channels.filter(channel => channel.type === 'GuildVoice').size}`,
                    inline: true
                },
            )

        if (serverIcon) embed.setThumbnail(serverIcon);
        if (serverBanner) embed.setImage(serverBanner);

        const test = {
            color: 0x0099ff,
            title: `${local.title} ${guild.name}`,
            thumbnail: {
                url: guild.iconURL(),
            },
            fields: [
                {name: `👑 ${local.owner}`, value: `\`\`\`fix\n${owner.user.username}\`\`\``, inline: true},
                {name: `🆔 ${local.serverid}`, value: `\`\`\`${guild.id}\`\`\``, inline: false},
                {name: `📅 ${local.date}`, value: `\`\`\`${formatDate(guild.createdAt)}\`\`\``, inline: true},
                {name: `👥 ${local.members}`, value: `\`\`\`${guild.memberCount}\`\`\``, inline: true},
                {name: `📺 ${local.channels}`, value: `\`\`\`${guild.channels.cache.size}\`\`\``, inline: true,},
            ],
        };

        await interaction.reply({embeds: [embed]});
    },
};