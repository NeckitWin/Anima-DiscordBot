import {getLang} from "../utils/lang.ts";
import {errorEmbed} from "../components/embeds/errorEmbed.ts";
import {CommandInteraction, Interaction} from "discord.js";

export const checkNotGuild = async (interaction: CommandInteraction | Interaction) => {
    const lang = await getLang(interaction);
    if (!interaction.guild) {
        const embed = errorEmbed(lang, lang.error.notguild);
        await interaction.reply({embeds: [embed], ephemeral: true});
        return true;
    } return false;
}