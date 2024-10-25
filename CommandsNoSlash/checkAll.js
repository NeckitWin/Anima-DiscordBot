module.exports = {
    name: 'check_all',
    description: 'Owner command',
    async execute(message) {
        try {
            const channel = await message.channel.fetch()
            console.log(channel.nsfw);
        } catch (e) {
            console.error(e)
        }
    }
}