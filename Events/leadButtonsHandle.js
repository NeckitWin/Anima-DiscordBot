const {EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events} = require("discord.js");
const {getLeaderboard} = require('../Data/funcs/dbUser');
const {getLang} = require("../Data/Lang");
const {commandLog} = require("../Data/funcs/commandLog");

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
        if (!(interaction.customId === `nextLeaders` || interaction.customId === `prevLeaders`)) return;
        if (!commandLog("leadButtonsHandle", interaction, 1)) return;
        const lang = await getLang(interaction);
        const local = lang.error;

        if (interaction.message.interaction.user.id !== interaction.user.id) return interaction.reply({
            content: local.notyourcommand,
            ephemeral: true
        });


        const result = await getLeaderboard(interaction.guild.id);

        const embed = new EmbedBuilder()
            .setTitle(`🏆 ${lang.auratop.title} ⚖️`)
            .setColor("#00ffa1")
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({
                text: `${lang.request} ${interaction.user.displayName}`,
                iconURL: interaction.user.avatarURL({dynamic: true, size: 4096})
            });

        if (!interaction.message.page) {
            interaction.message.page = 0;
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

        await interaction.update({embeds: [embed], components: [row]});
    }
};
