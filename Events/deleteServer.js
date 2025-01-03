const {Events, EmbedBuilder} = require("discord.js");

module.exports = {
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