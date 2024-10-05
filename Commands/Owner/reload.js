const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('../../Data/config.json');
const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const lang = require("../../Data/Lang");
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setNameLocalizations({ru: 'перезагрузить', pl: 'przeładuj', uk: 'перезавантажити'})
        .setDescription('Owner command, you cant use it')
        .setDescriptionLocalizations({
            ru: 'Команда владельца, вы не можете использовать её',
            pl: 'Komenda właściciela, nie możesz jej użyć',
            uk: 'Команда власника, ви не можете використовувати її'
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        allowedUserIds = ['429562004399980546'];
        const lang = await getLang(interaction);
        const local = lang.error;

        if (!allowedUserIds.includes(interaction.user.id)) {
            return interaction.reply({content:local.dontperm, ephemeral: true});
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