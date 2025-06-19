import {getLang} from "../utils/lang.ts";
import {errorEmbed} from "../components/embeds/errorEmbed.ts";
import {CommandInteraction, User} from "discord.js";

export const checkNotBot = async (interaction: CommandInteraction, user: User) => {
    const lang = await getLang(interaction);
    if (user.bot) {
        const embed = errorEmbed(lang, lang.error.dontbot);
        await interaction.reply({embeds: [embed], ephemeral: true});
        return true;
    } return false;
}