const {CommandInteraction, EmbedBuilder} = require('discord.js');

module.exports = {
    data: {
        name: 'servers',
        description: 'Owner command',
    },
    async execute(message) {
        try {
            const servers = message.client.guilds.cache.map(guild => "🎯"+guild.name+":"+"```js\n"+ guild.memberCount+" участников```").join("\n");
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Сервера бота')
                .setDescription(servers);
            await message.channel.send({embeds: [embed]});
        } catch (error) {
            console.error(`Ошибка при выполнении команды 'myServersBot': ${error}`);
        }
    }
}