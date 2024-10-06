const {Events, EmbedBuilder} = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");

const checkServer = async (interaction, embed) => {
    if (interaction.author?.bot) return;
    const serverID = interaction.guild.id;
    const pathFile = path.join(__dirname, "../Data/jsons/loggServers.json");
    const data = await fs.promises.readFile(pathFile, `utf-8`);
    const jsonData = JSON.parse(data);

    const thisServer = jsonData.find(el => el.server === serverID);

    const loggChannel = interaction.guild.channels.cache.get(thisServer.channel);
    await loggChannel.send({content: ``, embeds: [embed]});
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
            const embed = new EmbedBuilder()
                .setTitle(`Member Joined`)
                .setDescription(`Name: \`\`\`${member.user.displayName}\`\`\``)
                .addFields([
                    {name: `User ID`, value: `\`\`\`${member.user.id}\`\`\``, inline: true},
                    {name: `Username`, value: `\`\`\`${member.user.username}\`\`\``, inline: true}
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
            const embed = new EmbedBuilder()
                .setTitle(`Member Left Server`)
                .setDescription(`Name: \`\`\`${member.user.displayName}\`\`\``)
                .addFields([
                    {name: `User ID`, value: `\`\`\`${member.user.id}\`\`\``, inline: true},
                    {name: `Username`, value: `\`\`\`${member.user.username}\`\`\``, inline: true}
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
            const embed = new EmbedBuilder()
                .setTitle(`Message Deleted`)
                .setDescription(`\`\`\`${message.content}\`\`\``)
                .setFooter({text: `Author: ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                .setTimestamp()
                .setColor(`#ff0000`);

            await checkServer(message, embed);
        }
    },
    {
        name: Events.MessageUpdate,
        async execute(oldMessage, newMessage) {
            const embed = new EmbedBuilder()
                .setTitle(`Message Edited`)
                .setDescription(`Old Message: \`\`\`${oldMessage.content}\`\`\`\nNew Message: \`\`\`${newMessage.content}\`\`\``)
                .setFooter({
                    text: `Author: ${oldMessage.author.username}`,
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
            const embed = new EmbedBuilder()
                .setTitle(`Channel Created`)
                .setDescription(`Channel: ${channel}`)
                .setTimestamp()
                .setColor(`#00d9ff`);

            await checkServer(channel, embed);
        }
    }
]