import fs from 'node:fs';
// @ts-ignore
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import url, { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import dotenv from 'dotenv';
dotenv.config();
const client = new Client({
    intents: [
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});
client.commands = new Collection();
client.cooldowns = new Collection();
const __dirname = dirname(fileURLToPath(import.meta.url));
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = url.pathToFileURL(filePath);
        const command = await import(fileUrl.toString());
        if ('data' in command.default && 'execute' in command.default) {
            client.commands.set(command.default.data.name, command.default);
        }
        else {
            console.error(`Error in file ${file} 'data' or 'execute' properties not found!`);
        }
    }
}
client.on("ready", () => {
    console.log('Bot is ready!✅');
});
try {
    const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.ts'));
    for (const file of eventFiles) {
        const { default: event } = await import(url.pathToFileURL(path.join(__dirname, 'events', file)).toString());
        if (!event)
            continue;
        const events = Array.isArray(event) ? event : [event];
        events.forEach(e => {
            if (e && e.name && e.execute) {
                client[e.once ? 'once' : 'on'](e.name, e.execute);
            }
        });
    }
}
catch (error) {
    console.error('Error loading events:', error);
}
client.login(process.env.TOKEN);
