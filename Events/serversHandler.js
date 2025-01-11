const {Events, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = [
    {
        name: Events.GuildCreate,
        async execute(guild) {
            try {
                const myServerId = `1246052791097622528`;
                const myChannelId = `1289145043873169438`;
                const myServer = guild.client.guilds.cache.get(myServerId);
                const myChannel = myServer.channels.cache.get(myChannelId);
                const getOwner = await guild.members.fetch(guild.ownerId);
                const owner = getOwner.user;
                const memberCount = guild.memberCount;


                const embed = new EmbedBuilder()
                    .setTitle(`Bot added to new server`)
                    .setThumbnail(guild.iconURL())
                    .setColor(`#00ff9d`)
                    .addFields(
                        {name: `Guild Name:`, value: `\`\`\`fix\n${guild.name}\`\`\``, inline: false},
                        {name: `User count`, value: `\`\`\`fix\n${memberCount}\`\`\``, inline: true},
                        {name: `Guild Owner`, value: `\`\`\`fix\n${owner.username}\`\`\``, inline: true},
                        {name: `Owner ID`, value: `\`\`\`fix\n${owner.id}\`\`\``, inline: true}
                    );

                await myChannel.send({embeds: [embed]})
            } catch (e) {
                console.error(e);
            }
        }
    },
    {
        name: Events.GuildDelete,
        async execute(guild) {
            try {
                const myServerId = `1246052791097622528`;
                const myChannelId = `1289145043873169438`;
                const myServer = guild.client.guilds.cache.get(myServerId);
                const myChannel = myServer.channels.cache.get(myChannelId);
                const memberCount = guild.memberCount;

                const embed = new EmbedBuilder()
                    .setTitle(`Bot deleted from server`)
                    .setThumbnail(guild.iconURL())
                    .setColor(`#ff0044`)
                    .addFields(
                        {name: `Guild Name:`, value: `\`\`\`fix\n${guild.name}\`\`\``, inline: false},
                        {name: `User count`, value: `\`\`\`fix\n${memberCount}\`\`\``, inline: true}
                    );
                await myChannel.send({embeds: [embed]})
            } catch (e) {
                console.error(e);
            }
        }
    }
]