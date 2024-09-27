const {Events, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const myServerId = `1246052791097622528`;
        const myChannelId = `1289145043873169438`;
        const myServer = guild.client.guilds.cache.get(myServerId);
        const myChannel = myServer.channels.cache.get(myChannelId);
        const getOwner = await guild.members.fetch(guild.ownerId);
        const owner = getOwner.user;
        const userCount= guild.members.cache.size;

        const embed = new EmbedBuilder()
            .setTitle(`Bot added to new server`)
            .setThumbnail(guild.iconURL())
            .setColor(`#00ff9d`)
            .addFields(
                {name: `Guild Name:`, value: `\`\`\`fix\n${guild.name}\`\`\``, inline: false},
                {name: `User count`, value: `\`\`\`fix\n${userCount}\`\`\``, inline: true},
                {name: `Guild Owner`, value: `${owner}`, inline: true}
            );

        myChannel.send({embeds: [embed]})
    }
}