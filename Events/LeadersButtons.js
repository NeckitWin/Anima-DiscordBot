const {EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events} = require("discord.js");
const {getConnection} = require('../Data/db');

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
    cooldown: 5,
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const conn = getConnection();

        let prevNumber = 0;
        let nextNumber = 10;

        const sql = `SELECT * FROM wallet WHERE serverID = ? ORDER BY wallet.aura DESC`; // sort desc >
        conn.query(sql, [interaction.guild.id], (err, result) => {
            if (err) console.error(err);

            const embed = new EmbedBuilder()
                .setTitle("🏆 Ranking Aura Top ⚖️")
                .setColor("#00ffa1")
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({
                    text: `Requested by ${interaction.user.displayName}`,
                    iconURL: interaction.user.avatarURL({dynamic: true, size: 4096})
                });


            let auraLeaders;
            switch (interaction.customId) {
                case "nextLeaders":
                    prevNumber += 10;
                    nextNumber += 10;
                    if (nextNumber > result.length) {
                        nextNumber = result.length;
                        if (result.length >= 10) {
                            prevNumber = result.length - 10;
                        } else {
                            prevNumber = 0;
                        }
                    }
                    auraLeaders = result.slice(prevNumber, nextNumber);
                    auraLeaders.forEach((leader, index) => {
                        embed.addFields([
                            {
                                name: `#${index + prevNumber + 1}. ${leader.username}`,
                                value: `**Aura**: ${leader.aura}`,
                                inline: false
                            },
                        ])
                    })
                    interaction.update({embeds: [embed], components: [row]});
                    break;

                case "prevLeaders":
                    if (prevNumber >= 10) {
                        prevNumber -= 10;
                        nextNumber -= 10;
                    } else {
                        prevNumber = 0;
                        nextNumber = 10;
                    }
                    auraLeaders = result.slice(prevNumber, nextNumber);
                    auraLeaders.forEach((leader, index) => {
                        embed.addFields([
                            {
                                name: `#${index + 1}. ${leader.username}`,
                                value: `**Aura**: ${leader.aura}`,
                                inline: false
                            },
                        ])
                    })
                    interaction.update({embeds: [embed], components: [row]});
                    break;
            }
        })
    }
}


