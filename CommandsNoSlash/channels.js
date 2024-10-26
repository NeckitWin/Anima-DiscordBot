module.exports = {
    name: 'channels',
    description: 'show channels',
    async execute(message) {
        try {
            const serverChannels = await message.guild.channels.fetch();
            console.log(serverChannels);
            let channels = '';
            serverChannels.forEach((channel, index) => {channels += `${channel} `})
            message.channel.send(channels);

        } catch (err) {
            console.log('Error in file channels.js '+err);
        }
    }
}