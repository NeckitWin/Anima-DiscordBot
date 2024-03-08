const {Events, Message} = require('discord.js');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        readline.on('line', async (input) => {
            const [command, serverName, channelName, ...messageParts] = input.split(':');
            const message = messageParts.join(' ');

            if (command === 'say') {
                if (!serverName || !channelName || !message) {
                    console.error('Неверный формат. Введите: "Название сервера:название канала:Текстовое сообщение"');
                    return;
                }
                const guild = client.guilds.cache.find((guild) => guild.name === serverName);
                if (!guild) {
                    console.error(`Сервер "${serverName}" не найден.`);
                    return;
                }

                const channel = guild.channels.cache.find((channel) => channel.name === channelName);
                if (!channel) {
                    console.error(`Канал "${channelName}" не найден на сервере "${serverName}".`);
                    return;
                }
                if (channel.permissionsFor(client.user).has('SendMessages'))
                    try {
                        await channel.send(message);
                        console.log(`Сообщение "${message}" отправлено в канал "${channelName}" на сервере "${serverName}".`);
                    } catch (error) {
                        console.error(`Ошибка отправки сообщения: ${error}`);
                    }
                else {
                    console.error(`У меня нет прав на отправку сообщений в канал "${channelName}" на сервере "${serverName}".`);
                }
            }
        });
    }
};
