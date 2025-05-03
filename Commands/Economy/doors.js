import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import errorLog from "../../Utils/errorLog.js";
import {setCooldown} from "../../Utils/customCooldown.js";
import {getLang} from "../../Utils/lang.js";

export default {
    data: new SlashCommandBuilder()
        .setName('doors')
        .setNameLocalizations({
            ru: 'двери',
            pl: 'drzwi',
            uk: 'двері'
        })
        .setDescription("Open doors to find a treasure")
        .setDescriptionLocalizations({
            ru: "Открой двери, чтобы найти сокровища",
            pl: "Otwórz drzwi, aby znaleźć skarb",
            uk: "Відкрийте двері, щоб знайти скарб"
        }),
    async execute(interaction) {
        try {
            if (!await setCooldown("doors", interaction, 60)) return;
            const lang = await getLang(interaction);
            const local = lang.doors;

            const embed = new EmbedBuilder()
                .setTitle(local.title)
                .setDescription(local.description)
                .setColor('#00ff94')
                .setImage('https://i.pinimg.com/736x/27/9f/6b/279f6be8d8f4a408a8d22b89767cacd3.jpg');

            const firstDoor = new ButtonBuilder()
                .setCustomId('magicDoor1')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🚪')

            const secondDoor = new ButtonBuilder()
                .setCustomId('magicDoor2')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🚪')

            const thirdDoor = new ButtonBuilder()
                .setCustomId('magicDoor3')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🚪')

            const row = new ActionRowBuilder()
                .addComponents(firstDoor, secondDoor, thirdDoor);

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });
        } catch (err) {
            await errorLog(err);
        }
    }
}
