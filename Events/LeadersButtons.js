const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events } = require("discord.js");
const { getConnection } = require('../Data/db');

const prevButton = new ButtonBuilder()
    .setCustomId("prevLeaders")
    .setEmoji("<:emoji:1287203676418609223>")
    .setStyle(ButtonStyle.Success);

const nextButton = new ButtonBuilder()
    .setCustomId("nextLeaders")
    .setEmoji("<:emoji:1287203697469689856>")
    .setStyle(ButtonStyle.Success);

const row = new ActionRowBuilder()
    .addComponents(prevButton, nextButton);

const leadersFiltr = (embed, result, prevNumber, nextNumber) => {
    let auraLeaders = result.slice(prevNumber, nextNumber);
    auraLeaders.forEach((leader, index) => {
        embed.addFields([
            {
                name: `#${index + prevNumber + 1}. ${leader.serverName}`,
                value: `**Aura**: ${leader.aura}`,
                inline: false
            },
        ]);
    });
};

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const conn = getConnection();
        const sql = `SELECT * FROM wallet WHERE serverID = ? ORDER BY wallet.aura DESC`;

        conn.query(sql, [interaction.guild.id], (err, result) => {
            if (err) console.error(err);

            const embed = new EmbedBuilder()
                .setTitle("🏆 Ranking Aura Top ⚖️")
                .setColor("#00ffa1")
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({
                    text: `Requested by ${interaction.user.displayName}`,
                    iconURL: interaction.user.avatarURL({ dynamic: true, size: 4096 })
                });

            // Initialize the page number if it doesn't exist
            if (!interaction.message.page) {
                interaction.message.page = 0; // Start on the first page
            }

            let prevNumber = interaction.message.page * 10;
            let nextNumber = prevNumber + 10;

            switch (interaction.customId) {
                case "nextLeaders":
                    if (nextNumber < result.length) {
                        interaction.message.page++;
                    }
                    break;

                case "prevLeaders":
                    if (interaction.message.page > 0) {
                        interaction.message.page--;
                    }
                    break;
            }

            prevNumber = interaction.message.page * 10;
            nextNumber = prevNumber + 10;

            if (nextNumber > result.length) {
                nextNumber = result.length;
            }

            embed.fields = [];
            leadersFiltr(embed, result, prevNumber, nextNumber);

            interaction.update({ embeds: [embed], components: [row] });
        });
    }
};
