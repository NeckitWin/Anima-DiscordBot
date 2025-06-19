import {getLang} from "../utils/lang.ts";
import {errorEmbed} from "../components/embeds/errorEmbed.ts";
import {CommandInteraction, User} from "discord.js";

export const checkNotSelf = async (interaction: CommandInteraction, user: User) => {
    const lang = await getLang(interaction);
    if (interaction.user.id === user.id) {
        const embed = errorEmbed(lang, lang.error.dontyourself);
        await interaction.reply({embeds: [embed], ephemeral: true});
        return true;
    } return false;
}