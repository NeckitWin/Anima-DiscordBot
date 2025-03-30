import { Message } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

export default {
    name: 'messageCreate',
    async execute(message = new Message()) {
        try {

            if (!message.content.startsWith("!") || message.author.bot) return;

            const args = message.content.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
            const commandsPath = path.join(__dirname, '../CommandsNoSlash');

            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const fileUrl = url.pathToFileURL(filePath);

                const command = await import(fileUrl);

                if (command.default && command.default.name) {
                    if (commandName === command.default.name) {
                        await command.default.execute(message, args);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}