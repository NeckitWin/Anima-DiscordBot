import {getLang} from "../Utils/lang.js";
import {errorEmbed} from "../Components/Embeds/errorEmbed.js";

export const checkNotBot = async (interaction, user) => {
    const lang = await getLang(interaction);
    if (user.bot) {
        const embed = errorEmbed(lang, lang.error.dontbot);
        await interaction.reply({embeds: [embed], ephemeral: true});
        return true;
    } return false;
}