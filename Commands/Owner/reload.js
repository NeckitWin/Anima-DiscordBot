// Команда для регистрации всех команд в папке Commands

const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('../../Data/config.json');
const {SlashCommandBuilder} = require('discord.js');
// Нужно создать config.json в папке Data и вставить туда следующее:
// {"token": "Токен бота", "clientId": "ID бота"}

console.log("command Owner/reload.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Register all commands'),
    async execute(interaction) {
        allowedUserIds = ['429562004399980546'];

        if (!allowedUserIds.includes(interaction.user.id)) {
            return interaction.reply('You are not allowed to use this command');
        }

        const commands = [];
        const foldersPath = path.join(__dirname, '../');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(path.join(commandsPath, file));
                if (command.data) {
                    commands.push(command.data.toJSON());
                } else {
                    console.warn(`Command ${file} does not have a data property`);
                }
            }
        }

        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: commands },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
        await interaction.reply({content:'Commands successfully registered!✅', ephemeral: true});
    },

}