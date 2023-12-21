const fs= require('node:fs');
const path = require('node:path');
const {Client, Events, GatewayIntentBits, Collection} = require('discord.js')
const {token} = require('./Data/config.json')

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.commands = new Collection();

const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath)

        if ('data' in command && 'execute' in command){
            bot.commands.set(command.data.name, command);
        }else{
            console.log(`Ошибка в файле ${file} не найдены 'data' или 'execute' свойства!`)
        }
    }
}

bot.on('ready', () => {
    console.log("Бот успешно запущен! " + bot.user.tag);
});

bot.login(token);