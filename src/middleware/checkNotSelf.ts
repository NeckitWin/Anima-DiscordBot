import {getLang} from "../utils/lang.ts";
import {errorEmbed} from "../components/embeds/errorEmbed.ts";

export const checkNotSelf = async (interaction, user) => {
    const lang = await getLang(interaction);
    if (interaction.user.id === user.id) {
        const embed = errorEmbed(lang, lang.error.dontyourself);
        await interaction.reply({embeds: [embed], ephemeral: true});
        return true;
    } return false;
}