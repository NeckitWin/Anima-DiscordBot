const {Events, EmbedBuilder} = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
const {getLang} = require("../Data/Lang");

const checkServer = async (interaction, embed) => {
    try {
        if (interaction.author?.bot) return;
        const serverID = interaction.guild.id;
        const pathFile = path.join(__dirname, "../Data/jsons/loggServers.json");
        const data = await fs.promises.readFile(pathFile, `utf-8`);
        const jsonData = JSON.parse(data);
        const thisServer = jsonData.find(el => el.server === serverID);
        if (!thisServer) return;
        const loggChannel = interaction.guild.channels.cache.get(thisServer.channel);
        if (!loggChannel) return;
        await loggChannel.send({content: ``, embeds: [embed]});
    } catch (e) {
        console.error(e);
    }
}

const getLocal = async (interaction) => {
    return await getLang(interaction);
}

const channelTypeParse = (type) => {
    switch (type) {
        case 0: return `text`;
        case 2: return `voice`;
        case 15:return `forum`;
        case 4: return `category`;
        case 5: return `news`;
        case 13:return `stage`;
        default: return `unknown`;
    }
}

module.exports = [
    {
        name: Events.MessageCreate,
        async execute(message) {
            if (!message.author.bot) return console.log(`${message.guild}|${message.author.username} - ${message.content}`);
        }
    },
    {
        name: Events.GuildMemberAdd,
        async execute(member) {
            const lang = await getLocal(member);
            const localMember = lang.loggs.member;

            const embed = new EmbedBuilder()
                .setTitle(localMember.join)
                .setDescription(`${localMember.name}: \`\`\`${member.user.displayName}\`\`\``)
                .addFields([
                    {name: localMember.user_id, value: `\`\`\`${member.user.id}\`\`\``, inline: true},
                    {name: localMember.username, value: `\`\`\`${member.user.username}\`\`\``, inline: true}
                ])
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()
                .setColor(`#00ff00`);

            await checkServer(member, embed);
        }
    },
    {
        name: Events.GuildMemberRemove,
        async execute(member) {
            const lang = await getLocal(member);
            const localMember = lang.loggs.member;

            const embed = new EmbedBuilder()
                .setTitle(localMember.leave)
                .setDescription(`${localMember.name}: \`\`\`${member.user.displayName}\`\`\``)
                .addFields([
                    {name: localMember.user_id, value: `\`\`\`${member.user.id}\`\`\``, inline: true},
                    {name: localMember.username, value: `\`\`\`${member.user.username}\`\`\``, inline: true}
                ])
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()
                .setColor(`#ff0000`);

            await checkServer(member, embed);
        }
    },
    {
        name: Events.MessageDelete,
        async execute(message) {
            const lang = await getLocal(message);
            const localMessage = lang.loggs.message;

            const embed = new EmbedBuilder()
                .setTitle(localMessage.delete)
                .setDescription(`${localMessage.content}: \`\`\`${message.content}\`\`\``)
                .addFields([
                    {name: localMessage.message_id, value: `\`\`\`${message.id}\`\`\``, inline: false},
                    {name: localMessage.channel, value: `\`\`\`${message.channel.name}\`\`\``, inline: true},
                    {name: localMessage.channel_id, value: `\`\`\`${message.channel.id}\`\`\``, inline: true}
                ])
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter({
                    text: `${localMessage.author}: ${message.author.username}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .setColor(`#ff0000`);

            await checkServer(message, embed);
        }
    },
    {
        name: Events.MessageUpdate,
        async execute(oldMessage, newMessage) {
            const lang = await getLocal(newMessage);
            const localMessage = lang.loggs.message;

            const embed = new EmbedBuilder()
                .setTitle(localMessage.edit)
                .setDescription(`${localMessage.old}: \`\`\`${oldMessage.content}\`\`\`\n${localMessage.new}: \`\`\`${newMessage.content}\`\`\``)
                .setFooter({
                    text: `${localMessage.author}: ${oldMessage.author.username}`,
                    iconURL: oldMessage.author.displayAvatarURL()
                })
                .setTimestamp()
                .setColor(`#00d9ff`);

            await checkServer(oldMessage, embed);
        }
    },
    {
        name: Events.ChannelCreate,
        async execute(channel) {
            const lang = await getLocal(channel);
            const localChannel = lang.loggs.channel;

            const channelType = channelTypeParse(channel.type);
            const embed = new EmbedBuilder()
                .setTitle(localChannel.create)
                .setDescription(`${localChannel.channel}: ${channel}`)
                .addFields([
                    {name: localChannel.name, value: `\`\`\`${channel.name}\`\`\``, inline: true},
                    {name: localChannel.type, value: `\`\`\`${localChannel.types[channelType]}\`\`\``, inline: true},
                    {name: localChannel.channel_id, value: `\`\`\`${channel.id}\`\`\``, inline: false}
                ])
                .setThumbnail(channel.guild.iconURL())
                .setTimestamp()
                .setColor(`#00ff00`);

            await checkServer(channel, embed);
        }
    },
    {
        name: Events.ChannelDelete,
        async execute(channel) {
            const lang = await getLocal(channel);
            const localChannel = lang.loggs.channel;
            const channelType = channelTypeParse(channel.type);

            const embed = new EmbedBuilder()
                .setTitle(localChannel.delete)
                .setDescription(`${localChannel.channel}: ${channel}`)
                .addFields([
                    {name: localChannel.name, value: `\`\`\`${channel.name}\`\`\``, inline: true},
                    {name: localChannel.type, value: `\`\`\`${localChannel.types[channelType]}\`\`\``, inline: true},
                    {name: localChannel.channel_id, value: `\`\`\`${channel.id}\`\`\``, inline: false}
                ])
                .setThumbnail(channel.guild.iconURL())
                .setTimestamp()
                .setColor(`#ff0000`);

            await checkServer(channel, embed);
        }
    },
    {
        name: Events.ChannelUpdate,
        async execute(oldChannel, newChannel) {
            const lang = await getLocal(newChannel);
            const localChannel = lang.loggs.channel;
            const channelType = channelTypeParse(newChannel.type);

            const embed = new EmbedBuilder()
                .setTitle(localChannel.update)
                .setDescription(`${localChannel.channel}: ${newChannel}`)
                .addFields([
                    {name: localChannel.old, value: `\`\`\`${oldChannel.name}\`\`\``, inline: true},
                    {name: localChannel.new, value: `\`\`\`${newChannel.name}\`\`\``, inline: true},
                    {name: localChannel.type, value: `\`\`\`${localChannel.types[channelType]}\`\`\``, inline: false},
                    {name: localChannel.channel_id, value: `\`\`\`${newChannel.id}\`\`\``, inline: false}
                ])
                .setThumbnail(newChannel.guild.iconURL())
                .setTimestamp()
                .setColor(`#00d9ff`);

            await checkServer(oldChannel, embed);
        }
    }
]