import fs from 'node:fs';
import path, {dirname} from 'node:path';
import url, {fileURLToPath} from 'node:url';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
dotenv.config();

export default {
    name: 'reload_commands',
    description:  'Reload commands for the bot',
    async execute(message) {
        try {
            const allowedUserIds = ['429562004399980546'];
            if (!allowedUserIds.includes(message.user.id)) return;

            const commands = [];

            const __dirname = dirname(fileURLToPath(import.meta.url));
            const foldersPath = path.join(__dirname, '../../Commands');
            const commandFolders = fs.readdirSync(foldersPath);

            for (const folder of commandFolders) {
                const commandsPath = path.join(foldersPath, folder);
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    const fileUrl = url.pathToFileURL(filePath);
                    const command = await import(fileUrl);
                    if (command.default.data && typeof command.default.data.toJSON === 'function') {
                        commands.push(command.default.data.toJSON());
                    } else {
                        console.warn(`File ${file} does not export a command with data and a toJSON method.`);
                    }
                }
            }

            const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

            (async () => {
                try {
                    console.log('Started refreshing application (/) commands.');

                    await rest.put(
                        Routes.applicationCommands(process.env.CLIENT_ID),
                        {body: commands},
                    );

                    console.log('Successfully reloaded application (/) commands.');
                } catch (error) {
                    console.error(error);
                }
            })();
            await interaction.reply({content: 'Commands successfully registered!✅', ephemeral: true});
        } catch (err) {
            console.error(err);
        }
    }
}