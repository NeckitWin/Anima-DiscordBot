const fs = require('node:fs');
const path = require('node:path');
const {Client, Events, GatewayIntentBits, Collection} = require('discord.js')
const {token} = require('./Data/config.json')
const buttonsClick = require('./Events/buttonsClickOffer.js');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions]});

client.commands = new Collection();

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
    // change avatar
    // client.user.edit({ avatar: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDczeXRsMnJydzR4NDJqN2Vxa3NlY2hiYXd2ZTIxanE3Z2NucmZwbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TKb8rKIEF35mG7y2FY/giphy.gif" })
});

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
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);