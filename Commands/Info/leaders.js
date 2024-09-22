const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {getConnection} = require("../../Data/db");

const prevButton = new ButtonBuilder()
    .setCustomId("prevLeaders")
    .setEmoji("<:emoji:1287203676418609223>")
    .setStyle(ButtonStyle.Success);

const nextButton = new ButtonBuilder()
    .setCustomId("nextLeaders")
    .setEmoji("<:emoji:1287203697469689856>")
    .setStyle(ButtonStyle.Success);

const row = new ActionRowBuilder()
    .addComponents(prevButton, nextButton)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaders')
        .setDescription('Leaders aura'),
    async execute(interaction) {
        const conn = getConnection();

        const sql = `SELECT * FROM wallet WHERE serverID = ?`;
        conn.query(sql, [interaction.guild.id], (err, result) => {
            if (err) console.error(err);
            const auraLeaders = result.slice(0,11);
            const leaders = interaction.guild.members.fetch(interaction.user.id);

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

            interaction.reply({embeds: [embed], components: [row]});
        })
    }
}