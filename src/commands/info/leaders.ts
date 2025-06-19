import {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    CommandInteraction
} from "discord.js";
import {getAuraList} from "../../repo/auraRepository.ts";
import { getLang } from "../../utils/lang.ts";
import errorLog from "../../utils/errorLog.ts";

const prevButton = new ButtonBuilder()
    .setCustomId("prevLeaders")
    .setEmoji("<:emoji:1287203676418609223>")
    .setStyle(ButtonStyle.Success);

const nextButton = new ButtonBuilder()
    .setCustomId("nextLeaders")
    .setEmoji("<:emoji:1287203697469689856>")
    .setStyle(ButtonStyle.Success);

const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(prevButton, nextButton)

export default {
    data: new SlashCommandBuilder()
        .setName('leaders')
        .setNameLocalizations({ru: 'лидеры', pl: 'liderzy', uk: 'лідери'})
        .setDescription('Leaders aura')
        .setDescriptionLocalizations({
            ru: 'Лидеры ауры',
            pl: 'Liderzy aury',
            uk: 'Лідери аури'
        }),
    async execute(interaction: CommandInteraction) {
        try {
            let prevNumber = 0;
            let nextNumber = 10;

            const lang = await getLang(interaction);
            if (!interaction.guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});

            const leaderboard = await getAuraList(interaction.guild.id);

            if (!leaderboard) {
                const embedError = new EmbedBuilder()
                    .setColor("#d80000")
                    .setTitle(lang.auratop.empty)
                return await interaction.reply({embeds: [embedError]});
            }

            const auraLeaders = leaderboard.slice(prevNumber, nextNumber);

            const embed = new EmbedBuilder()
                .setTitle(`🏆 ${lang.auratop.title} ⚖️`)
                .setColor("#00ffa1")
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({
                    text: `${lang.request} ${interaction.user.displayName}`,
                    iconURL: interaction.user.avatarURL({size: 4096})!
                })
            ;

            auraLeaders.forEach((leader: any, index: number) => {
                embed.addFields([
                    {
                        name: `#${index + 1}. ${leader.displayName}`,
                        value: `**${lang.aura.aura}**: ${leader.aura}`,
                        inline: false
                    },
                ])
            })

            await interaction.reply({embeds: [embed], components: [row]});

        } catch (err) {
            await errorLog(err);
        }
    }
}