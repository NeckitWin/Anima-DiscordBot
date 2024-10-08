const fs = require('node:fs');
const path = require('node:path');
const {Client, Events, GatewayIntentBits, Collection, ActivityType} = require('discord.js');
const {token, sdcKEY} = require('./Data/config.json');
const SDC = require("@megavasiliy007/sdc-api");

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates]});

client.commands = new Collection();
client.cooldown = new Collection();

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
        activities: [{ name: `/help`, type: ActivityType.Competing }],
        status: 'idle',
    });
})

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
            } else {
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            }
        }
    }
});


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

// client.on(Events.ClientReady, async interaction => {
//     const sdc = new SDC(sdcKEY);
//     sdc.setAutoPost(client);
// })

client.login(token);