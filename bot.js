import fs from 'node:fs';
import {Client, GatewayIntentBits, Collection, ActivityType} from 'discord.js';
import url, {fileURLToPath} from 'node:url';
import path, {dirname} from 'node:path';
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
const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = url.pathToFileURL(filePath);

        const command = await import(fileUrl);
        if ('data' in command.default && 'execute' in command.default) {
            client.commands.set(command.default.data.name, command.default);
        } else {
            console.log(`Ошибка в файле ${file} не найдены 'data' или 'execute' свойства!`);
        }
    }
}

client.on("ready", () => {
    console.log('Bot is ready!✅');

    client.user.setPresence({
        activities: [{
            name: `/help me`,
            type: ActivityType.Streaming,
            url: 'https://www.youtube.com/watch?v=_bYFu9mBnr4&ab_channel=CalebCurry'
        }],
        status: 'idle',
    });
})

const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const fileURL = url.pathToFileURL(filePath);
    const events = await import(fileURL);

    if (Array.isArray(events)) {
        for (const event of events) {
            if (event.once) {
                client.once(event.default.name, (...args) => event.default.execute(...args));
            } else {
                client.on(event.default.name, (...args) => event.default.execute(...args));
            }
        }
    } else {
        if (events.once) {
            client.once(events.default.name, (...args) => events.default.execute(...args));
        } else {
            client.on(events.default.name, (...args) => events.default.execute(...args));
        }
    }
}

client.login(process.env.TOKEN);