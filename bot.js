const Discord = require('discord.js')
const bot = new Discord.Client({intents: ['Guilds', 'GuildMessages']})
const fs = require('fs');
const id = '!';

bot.on('ready', () => {
    console.log("Бот успешно запущен! " + bot.user.tag);
});

let data = fs.readFileSync('token.json', 'utf8');
let token = JSON.parse(data);

bot.login(token);