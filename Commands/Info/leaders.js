const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {getConnection} = require("../../Data/db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaders')
        .setDescription('Leaders aura'),
    async execute(interaction) {
        const conn = getConnection();

        const sql = `SELECT * FROM wallet JOIN users ON wallet.userID = users.userID WHERE serverID = ?`;
        conn.query(sql, [interaction.guild.id], (err, result) => {
            if (err) console.error(err);
            const auraLeaders = result.slice(0,11);

            const user = interaction.user;
            user.fetch();
            console.log(user.avatarURL());

            const embed = new EmbedBuilder()
                .setTitle("🏆 Ranking Aura Top ⚖️")
                .setColor("#00ffa1")
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.avatarURL({dynamic: true, size: 4096})})
            ;

            auraLeaders.forEach((leader, index) => {
                embed.addFields([
                    {name: `#${index+1}. ${leader.username}`, value: `**Aura**: ${leader.aura}`, inline: false},
                ])
            })

            interaction.reply({embeds: [embed]});
        })
    }
}