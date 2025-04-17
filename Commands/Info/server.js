import {SlashCommandBuilder, EmbedBuilder, ChannelType} from "discord.js";
import {formatDate, serverProtection} from "../../Utils/utility.js";
import { getLang } from "../../Utils/lang.js";


export default {
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
        try {
            const lang = await getLang(interaction);
            if (!interaction.guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});
            const local = lang.server;

            const guild = interaction.guild;
            const owner = await guild.fetchOwner();
            const serverIcon = guild.iconURL();
            const serverBanner = guild.bannerURL();
            const members = await guild.members.fetch();
            const channels = await guild.channels.fetch();

            const threadsCount = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildForum)
                .reduce((count, forumChannel) => count + forumChannel.threads.cache.size, 0);

            let publicThreadsCount = 0;
            let privateThreadsCount = 0;

            guild.channels.cache
                .filter(channel =>
                    channel.type === ChannelType.GuildText ||
                    channel.type === ChannelType.GuildNews)
                .forEach((channel) => {
                    const threads = (channel).threads?.cache;
                    if (threads) {
                        publicThreadsCount += threads.filter(thread => thread.type === ChannelType.PublicThread).size;
                        privateThreadsCount += threads.filter(thread => thread.type === ChannelType.PrivateThread).size;
                    }
                });

            const embed = new EmbedBuilder()
                .setTitle(`${local.title} ${guild.name}`)
                .setColor(`#ff2e77`)
                .setAuthor({name: owner.user.displayName, iconURL: owner.user.avatarURL()})
                .setDescription(`<:owner:1294739459656519690> ${local.owner}: \`${owner.user.username}\`\n` +
                    `<:protect:1294739476832190514> ${local.serverid}: \`${guild.id}\`\n`)
                .addFields(
                    {
                        name: local.members,
                        value: `<:members:1294739398822334475> ${local.total}: ${members.size}\n` +
                            `<:member:1294739382112358541> ${local.people}: ${members.filter(member => !member.user.bot).size}\n` +
                            `<:bot:1294739043048886352> ${local.bots}: ${members.filter(member => member.user.bot).size}\n` +
                            `<:online:1294745413085302925> ${local.online}: ${members.filter(member => member.presence?.status === 'online').size}\n` +
                            `<:idle:1294745429451473048> ${local.idle}: ${members.filter(member => member.presence?.status === 'idle').size}\n` +
                            `<:dnd:1294745439567876250> ${local.dnd}: ${members.filter(member => member.presence?.status === 'dnd').size}\n` +
                            `<:invisible:1294745501941501952> ${local.offline}: ${members.filter(member => member.presence?.status === undefined).size}`,
                        inline: true
                    },
                    {
                        name: local.channels,
                        value: `<:channels:1295439867014025216> ${local.total}: ${channels.size}\n` +
                            `<:category:1294739077727256737> ${local.category}: ${channels.filter(channel => channel.type === 4).size}\n` +
                            `<:text:1294739741199171625> ${local.text}: ${channels.filter(channel => channel.type === 0).size}\n` +
                            `<:voice:1294739840524357715> ${local.voice}: ${channels.filter(channel => channel.type === 2).size}\n` +
                            `<:forum:1294739216621895761> ${local.forum}: ${channels.filter(channel => channel.type === 15).size}\n` +
                            `<:forum_thread:1295439879618171012> ${local.post}: ${threadsCount}\n` +
                            `<:thread:1294739750267392040> ${local.thread}: ${publicThreadsCount}\n` +
                            `<:private_thread:1295440455475134524> ${local.pthread}: ${privateThreadsCount}\n` +
                            `<:stage:1294739676795637902> ${local.stage}: ${channels.filter(channel => channel.type === 13).size}`,
                        inline: true
                    },
                    {
                        name: local.main,
                        value: `<:moderator:1294739417402970132> ${local.security}: ${local[serverProtection(guild.verificationLevel)]}\n` +
                            `<:two_members:1294739793779097660> ${local.roles}: ${guild.roles.cache.size - 1}\n` +
                            `<:designer:1294739122489135256> ${local.emojis}: ${guild.emojis.cache.size}\n` +
                            `<:boost:1294739031762141184> ${local.level}: ${guild.premiumTier}\n` +
                            `<:nitro:1294739428761141338> ${local.boost}: ${guild.premiumSubscriptionCount}\n` +
                            `<:calendar:1294739054876950549> ${local.date}: ${formatDate(guild.createdAt)}`,
                        inline: true
                    },
                )

            if (serverIcon) embed.setThumbnail(serverIcon);
            if (serverBanner) embed.setImage(serverBanner);

            await interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
}