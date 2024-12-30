const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`);
const {getLang} = require("../../Data/Lang");
const {getUserServer} = require("../../Data/funcs/dbUser");
const {commandLog} = require("../../Data/funcs/commandLog");
const commandName = 'balance';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setNameLocalizations({ru: `баланс`, pl: `bilans`, uk: `баланс`})
        .setDescription(`Shows your shard balance`)
        .setDescriptionLocalizations({
            ru: `Показывает ваш баланс шардов`,
            pl: `Pokazuje Twój bilans odłamków`,
            uk: `Показує ваш баланс уламків`
        }).addUserOption(option => option
            .setName('user')
            .setNameLocalizations({ru: 'пользователь', pl: 'użytkownik', uk: 'користувач'})
            .setDescription('User to show balance')
            .setDescriptionLocalizations({
                ru: 'Пользователь для показа баланса',
                pl: 'Użytkownik do pokazania bilansu',
                uk: 'Користувач для показу балансу'
            }).setRequired(false)),
    async execute(interaction) {
        try {
            if (!commandLog(commandName, interaction)) return;
            const user = interaction.options.getUser('user') || interaction.user;
            const {guild} = interaction;
            const lang = await getLang(interaction);
            if (!guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});
            const guildID = guild.id;
            const userMember = await guild.members.fetch(user.id);
            const balance = await getUserServer(user.id, guildID);
            const userAvatar = user.displayAvatarURL();
            const userColor = userMember.displayColor;

            const embed = new EmbedBuilder()
                .setTitle(`Баланс пользователя ${user.displayName}`)
                .setDescription(`Баланс составляет ${balance[0]?.shards ?? 0} осколков<:shard:1296969847690760234>`)
                .setThumbnail(userAvatar)
                .setColor(userColor);

            await interaction.reply({embeds: [embed]});
        } catch (e) {
            console.error(e);
        }

    }
}