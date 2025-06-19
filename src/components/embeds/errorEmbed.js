import { EmbedBuilder } from "discord.js";
export const errorEmbed = (lang, error) => {
    return new EmbedBuilder()
        .setTitle(`⚠️ ${lang.error.error}`)
        .setDescription(error)
        .setColor('#d80000');
};
