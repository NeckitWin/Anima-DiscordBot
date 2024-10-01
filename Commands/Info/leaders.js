const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {getLeaderboard} = require("../../Data/funcs/db");
const {getCooldown} = require("../../Data/funcs/cooldown");

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
        .setNameLocalizations({ru: 'лидеры', pl: 'liderzy', uk: 'лідери'})
        .setDescription('Leaders aura')
        .setDescriptionLocalizations({
            ru: 'Лидеры ауры',
            pl: 'Liderzy aury',
            uk: 'Лідери аури'
        }),
    async execute(interaction) {
        let prevNumber = 0;
        let nextNumber = 10;

        const leaderboard = await getLeaderboard(interaction.guild.id);

        const auraLeaders = leaderboard.slice(prevNumber, nextNumber);

        const embed = new EmbedBuilder()
            .setTitle("🏆 Ranking Aura Top ⚖️")
            .setColor("#00ffa1")
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({
                text: `Requested by ${interaction.user.displayName}`,
                iconURL: interaction.user.avatarURL({dynamic: true, size: 4096})
            })
        ;

        auraLeaders.forEach((leader, index) => {
            embed.addFields([
                {name: `#${index + 1}. ${leader.serverName}`, value: `**Aura**: ${leader.aura}`, inline: false},
            ])
        })

        await interaction.reply({embeds: [embed], components: [row]});

    }
}