const {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, EmbedBuilder} = require(`discord.js`)
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`autorole`)
        .setDescription(`Manage your roles on your servers`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add the role for autorole')
                .addRoleOption(option => option
                    .setName('role')
                    .setDescription('The role for autorole')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List of autorole roles'))
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('Remove the role for autorole')
            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role for autorole')
                .setRequired(true))),
    async execute(interaction) {;
        const botMember = interaction.guild.members.me;
        if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: `I don't have permission to manage roles`, ephemeral: true});
        const serverID = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();
        const roleTarget = interaction.options.getRole('role');
        const roleID = roleTarget ? roleTarget.id : null;

        const pathFile = path.join(__dirname, '../../Data/jsons/autoRoleServers.json');
        const data = await fs.promises.readFile(pathFile, 'utf8');
        const jsonData = JSON.parse(data);
        const thisServer = jsonData.find(el=>el.server===serverID);

        if (subcommand === `list`) {
            const embed = new EmbedBuilder()
                .setTitle(`List of autorole roles`)
                .setColor(`#d998ff`)
                .setThumbnail(interaction.guild.iconURL());

            thisServer.roles.map(el => {
                embed.addFields([
                    {
                        name: ` ID: ${el}`,
                        value: `Role: <@&${el}>`,
                        inline: false
                    }
                ]);
            })
            await interaction.reply({embeds: [embed]});

        } else if (subcommand === "add") {

            if (thisServer) { // if server was json
                if (!thisServer.roles.includes(roleID)) thisServer.roles.push(roleID);
                else return await interaction.reply({content: "Role has already been set", ephemeral: true})

            } else {
                jsonData.push({
                    server: serverID,
                    roles: [roleID]
                });
            }
            const parseDataJson = JSON.stringify(jsonData, null, 2);
            await fs.promises.writeFile(pathFile, parseDataJson);
            await interaction.reply({content: `Role <@&${roleID}> added to autorole list`, ephemeral: true})

        } else if (subcommand === "remove") {

            if (thisServer) { // if server was json
                if (!thisServer.roles.includes(roleID)) return await interaction.reply({content: `Role wasn't in the list`, ephemeral: true});
                else thisServer.roles = thisServer.roles.filter(el => el !== roleID);
            } else return await interaction.reply({content: `Role wasn't in the list`, ephemeral: true});

            const parseDataJson = JSON.stringify(jsonData, null, 2);
            await fs.promises.writeFile(pathFile, parseDataJson);
            await interaction.reply({content: `Role <@&${roleID}> removed from autorole list`, ephemeral: true});
        }
    }
}