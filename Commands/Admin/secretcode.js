const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, PermissionsBitField} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('secret-code')
        .setDescription('Manage secret codes for users to enter in status to receive a secret role')
        .setNameLocalizations({ru: 'секретный-код', pl: 'kod-tajny', uk: 'секретний-код'})
        .setDescriptionLocalizations({
            ru: 'Управление кодами для статуса, которые дают секретную роль',
            pl: 'Zarządzaj kodami statusu, które dają tajną rolę',
            uk: 'Керуйте кодами для статусу, що дають секретну роль'
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set a secret code for a specific role')
                .setNameLocalizations({ru: 'установить', pl: 'ustaw', uk: 'встановити'})
                .setDescriptionLocalizations({
                    ru: 'Установите секретный код для определенной роли',
                    pl: 'Ustaw kod tajny dla określonej roli',
                    uk: 'Встановіть секретний код для певної ролі'
                })
                .addRoleOption(option => option
                    .setName('role')
                    .setDescription('Choose the role for the secret code')
                    .setNameLocalizations({ru: 'роль', pl: 'rola', uk: 'роль'})
                    .setDescriptionLocalizations({
                        ru: 'Выберите роль для секретного кода',
                        pl: 'Wybierz rolę dla kodu tajnego',
                        uk: 'Виберіть роль для секретного коду'
                    })
                    .setRequired(true))
                .addStringOption(option => option
                    .setName(`status`)
                    .setDescription('Enter the status users need to set to receive the role')
                    .setNameLocalizations({ru: 'статус', pl: 'status', uk: 'статус'})
                    .setDescriptionLocalizations({
                        ru: 'Введите статус, который нужно установить пользователю для получения роли',
                        pl: 'Wprowadź status, który użytkownicy muszą ustawić, aby otrzymać rolę',
                        uk: 'Введіть статус, який користувачі повинні встановити для отримання ролі'
                    })
                    .addChoices([
                        {
                            name: 'online',
                            name_localizations: {ru: 'онлайн', pl: 'online', uk: 'онлайн'},
                            value: 'online'
                        },
                        {
                            name: 'idle',
                            name_localizations: {ru: 'не активен', pl: 'idle', uk: 'не активний'},
                            value: 'idle'
                        },
                        {
                            name: 'dnd',
                            name_localizations: {ru: 'не беспокоить', pl: 'dnd', uk: 'не турбувати'},
                            value: 'dnd'
                        }
                    ])
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('code')
                    .setDescription('Enter the secret code')
                    .setNameLocalizations({ru: 'код', pl: 'kod', uk: 'код'})
                    .setDescriptionLocalizations({
                        ru: 'Введите секретный код',
                        pl: 'Wprowadź kod tajny',
                        uk: 'Введіть секретний код'
                    })
                    .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Show the list of secret codes and their roles')
                .setNameLocalizations({ru: 'список', pl: 'lista', uk: 'список'})
                .setDescriptionLocalizations({
                    ru: 'Показать список секретных кодов и их ролей',
                    pl: 'Pokaż listę tajnych kodów i ich ról',
                    uk: 'Показати список секретних кодів і їх ролей'
                })
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a secret code and its associated role')
                .setNameLocalizations({ru: 'удалить', pl: 'usuń', uk: 'видалити'})
                .setDescriptionLocalizations({
                    ru: 'Удалить секретный код и его связанную роль',
                    pl: 'Usuń kod tajny i przypisaną rolę',
                    uk: 'Видалити секретний код та його пов’язану роль'
                })
                .addRoleOption(option => option
                    .setName('role')
                    .setDescription('Choose the role to remove the secret code')
                    .setNameLocalizations({ru: 'роль', pl: 'rola', uk: 'роль'})
                    .setDescriptionLocalizations({
                        ru: 'Выберите роль для удаления секретного кода',
                        pl: 'Wybierz rolę do usunięcia kodu tajnego',
                        uk: 'Виберіть роль для видалення секретного коду'
                    })
                    .setRequired(true))
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildID = interaction.guild.id;
        const guildStringID = guildID.toString();
        const filePath = path.join(__dirname, '../../Data/jsons/secretCodes.json');
        const secretCodeData = await fs.promises.readFile(filePath, 'utf8');
        const lang = await getLang(interaction);

        const botMember = interaction.guild.members.me;
        if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({
            content: lang.error.botdontpermrole,
            ephemeral: true
        });

        const secretCodeJSON = JSON.parse(secretCodeData);
        if (subcommand === 'set') {
            const role = interaction.options.getRole('role');
            const roleID = role.id;
            const status = interaction.options.getString('status');
            const secretCode = interaction.options.getString('code');

            if (!secretCodeJSON[guildStringID]) secretCodeJSON[guildStringID] = [];

            if (secretCodeJSON[guildStringID].some(item => item.role === roleID)) {
                return await interaction.reply({
                    content: `Role <@&${roleID}> already has an associated secret code.`,
                    ephemeral: true
                });
            }

            secretCodeJSON[guildStringID].push({role: roleID, code: secretCode, status: status});
            await fs.promises.writeFile(filePath, JSON.stringify(secretCodeJSON, null, 2));
            await interaction.reply({
                content: `Secret code **${secretCode}** has been set for role <@&${role.id}>.`,
                ephemeral: true
            });

        } else if (subcommand === 'list') {
            if (!secretCodeJSON[guildStringID] || secretCodeJSON[guildStringID].length === 0) {
                return await interaction.reply({
                    content: 'No secret codes found for this server.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle('Secret Codes List')
                .setColor('#ffcc00')
                .setThumbnail(interaction.guild.iconURL());

            secretCodeJSON[guildStringID].forEach(item => {
                embed.addFields({
                    name: `Code: **${item.code}**`,
                    value: `Role: <@&${item.role}> | Status: **${item.status}**`
                });
            });

            await interaction.reply({embeds: [embed], ephemeral: true});
        } else if (subcommand === 'remove') {
            const role = interaction.options.getRole('role');
            const roleID = role.id;

            if (!secretCodeJSON[guildStringID] || !secretCodeJSON[guildStringID].some(item => item.role === roleID)) {
                return await interaction.reply({
                    content: `Role <@&${roleID}> does not have an associated secret code.`,
                    ephemeral: true
                });
            }

            secretCodeJSON[guildStringID] = secretCodeJSON[guildStringID].filter(item => item.role !== roleID);

            await fs.promises.writeFile(filePath, JSON.stringify(secretCodeJSON, null, 2));
            await interaction.reply({
                content: `Secret code for role <@&${roleID}> has been removed.`,
                ephemeral: true
            });
        }
    }
};