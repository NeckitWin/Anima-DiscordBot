import { Message } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

export default {
    name: 'messageCreate',
    async execute(message = new Message()) {
        if (!message.content.startsWith("!") || message.author.bot) return;

        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const commandsFolder = path.join(__dirname, '../CommandsNoSlash');

        fs.readdir(commandsFolder, (err, files) => {
            if (err) return console.error(err);

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