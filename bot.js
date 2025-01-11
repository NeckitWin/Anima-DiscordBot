const fs = require('node:fs');
const path = require('node:path');
const {Client, GatewayIntentBits, Collection, ActivityType} = require('discord.js');
const {token} = require('./Data/config.json');

const client = new Client({intents: [GatewayIntentBits.GuildPresences, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates]});

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath)

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`Ошибка в файле ${file} не найдены 'data' или 'execute' свойства!`)
        }
    }
}

client.on("ready", () => {
    console.log('Bot is ready!✅');

    client.user.setPresence({
        activities: [{ name: `/help me`, type: ActivityType.Streaming, url: 'https://www.youtube.com/watch?v=_bYFu9mBnr4&ab_channel=CalebCurry' }],
        status: 'idle',
    });
})

const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const events = require(filePath);

    if (Array.isArray(events)) {
        for (const event of events) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    } else {
        if (events.once) {
            client.once(events.name, (...args) => events.execute(...args));
        } else {
            client.on(events.name, (...args) => events.execute(...args));
        }
    }
}

client.login(token);