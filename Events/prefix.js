const {Client, Message} = require('discord.js');
const fs = require('fs');
const path = require('path');

console.log("event prefixEvent.js loaded✅");

module.exports = {
    name: 'messageCreate',
    async execute(message = new Message()) {
        if (!message.content.startsWith("!") || message.author.bot) return;

        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Путь к папке с командами
        const commandsFolder = path.join(__dirname, '../CommandsNoSlash');

        // Чтение файлов из папки с командами
        fs.readdir(commandsFolder, (err, files) => {
            if (err) return console.error(err);

            // Поиск команды среди файлов
            for (const file of files) {
                if (file.endsWith('.js')) {
                    const command = require(`${commandsFolder}/${file}`);
                    if (command && command.name) {
                        if (commandName === command.name) {
                            command.execute(message, args);
                            break;
                        }
                    }

                }
            }
        });
    }
}