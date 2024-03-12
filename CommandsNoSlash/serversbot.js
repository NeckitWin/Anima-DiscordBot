const {CommandInteraction, EmbedBuilder} = require('discord.js');

module.exports = {
        name: 'serversbot',
        description: 'Owner command',
    async execute(message) {
        try {
        if (!message.channel.permissionsFor(message.client.user).has("SendMessages")) return;
        if (message.author.id !== '429562004399980546') return;
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