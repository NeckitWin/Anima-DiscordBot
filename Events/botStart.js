const {Events, EmbedBuilder} = require(`discord.js`);

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const guildID = `1246052791097622528`;
        const channelStatusID = `1297147457402310696`;
        const guild = client.guilds.cache.get(guildID);
        const channel = guild.channels.cache.get(channelStatusID);
        const botAvatar = client.user.displayAvatarURL();

        const embed = new EmbedBuilder()
            .setColor(`#00ffa1`)
            .setTitle(`Status Bot`)
            .setDescription(`Bot successfully launched!`)
            .setThumbnail(botAvatar);

        channel.send({embeds: [embed]});
    }
}