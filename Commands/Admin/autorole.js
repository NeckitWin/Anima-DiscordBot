const {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, EmbedBuilder} = require(`discord.js`)
const fs = require("node:fs");
const path = require("node:path");
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`autorole`)
        .setNameLocalizations({ru: `автороль`, pl: `autorola`, uk: `автороль`})
        .setDescription(`Set autorole for your server`)
        .setDescriptionLocalizations({
            ru: `Установить автороль для вашего сервера`,
            pl: `Ustaw autorolę dla swojego serwera`,
            uk: `Встановити автороль для вашого сервера`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setNameLocalizations({ru: `добавить`, pl: `dodaj`, uk: `додати`})
                .setDescription('Add the role for autorole')
                .setDescriptionLocalizations({
                    ru: `Добавить роль для автороли`,
                    pl: `Dodaj rolę dla autoroli`,
                    uk: `Додати роль для авторолі`
                })
                .addRoleOption(option => option
                    .setName('role')
                    .setNameLocalizations({ru: `роль`, pl: `rola`, uk: `роль`})
                    .setDescription('Choose the role for autorole')
                    .setDescriptionLocalizations({
                        ru: `Выберите роль для автороли`,
                        pl: `Wybierz rolę dla autoroli`,
                        uk: `Виберіть роль для авторолі`
                    })
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setNameLocalizations({ru: `список`, pl: `lista`, uk: `список`})
                .setDescription('List of autorole roles'))
                .setDescriptionLocalizations({
                    ru: `Установить автороль для вашего сервера`,
                    pl: `Ustaw autorolę dla swojego serwera`,
                    uk: `Встановити автороль для вашого сервера`
                })
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setNameLocalizations({ru: `удалить`, pl: `usuń`, uk: `видалити`})
            .setDescription('Remove the role for autorole')
            .setDescriptionLocalizations({
                ru: `Удалить роль для автороли`,
                pl: `Usuń rolę dla autoroli`,
                uk: `Видалити роль для авторолі`
            })
            .addRoleOption(option => option
                .setName('role')
                .setNameLocalizations({ru: `роль`, pl: `rola`, uk: `роль`})
                .setDescription('The role for delete from autorole')
                .setDescriptionLocalizations({
                    ru: `Роль для удаления из автороли`,
                    pl: `Rola do usunięcia z autoroli`,
                    uk: `Роль для видалення з авторолі`
                })
                .setRequired(true))),
    async execute(interaction) {
        const lang = await getLang(interaction);
        const local = lang.autorole;
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({content: lang.error.commandforadmin, ephemeral: true});

        const botMember = interaction.guild.members.me;
        if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({
            content: lang.error.botdontpermrole,
            ephemeral: true
        });
        const serverID = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();
        const roleTarget = interaction.options.getRole('role');
        const roleID = roleTarget ? roleTarget.id : null;

        const pathFile = path.join(__dirname, '../../Data/jsons/autoRoleServers.json');
        const data = await fs.promises.readFile(pathFile, 'utf8');
        const jsonData = JSON.parse(data);
        const thisServer = jsonData.find(el => el.server === serverID);

        if (subcommand === `list`) {
            const embed = new EmbedBuilder()
                .setTitle(local.list)
                .setColor(`#d998ff`)
                .setThumbnail(interaction.guild.iconURL());

            if (!thisServer) return await interaction.reply({content: local.noroles, ephemeral: true});
            thisServer.roles.map(el => {
                embed.addFields([
                    {
                        name: `${local.id}: ${el}`,
                        value: `${local.role}: <@&${el}>`,
                        inline: false
                    }
                ]);
            })
            await interaction.reply({embeds: [embed]});

        } else if (subcommand === "add") {
            if (botMember.roles.highest.position < roleTarget.position) return await interaction.reply({content: lang.error.bothigherrole, ephemeral: true});

            if (thisServer) { // if server was json
                if (!thisServer.roles.includes(roleID)) thisServer.roles.push(roleID);
                else return await interaction.reply({content: local.rolehas, ephemeral: true})

            } else {
                jsonData.push({
                    server: serverID,
                    roles: [roleID]
                });
            }
            const parseDataJson = JSON.stringify(jsonData, null, 2);
            await fs.promises.writeFile(pathFile, parseDataJson);
            await interaction.reply({content: `${local.role} <@&${roleID}> ${local.roleadd}`, ephemeral: true})

        } else if (subcommand === "remove") {

            if (thisServer) { // if server was json
                if (!thisServer.roles.includes(roleID)) return await interaction.reply({content: local.rolewasnt, ephemeral: true});
                else thisServer.roles = thisServer.roles.filter(el => el !== roleID);
            } else return await interaction.reply({content: local.rolewasnt, ephemeral: true});

            const parseDataJson = JSON.stringify(jsonData, null, 2);
            await fs.promises.writeFile(pathFile, parseDataJson);
            await interaction.reply({content: `${local.role} <@&${roleID}> ${local.roleremove}`, ephemeral: true});
        }
    }
}