import { Events, EmbedBuilder } from 'discord.js';
import { clearTimer } from '../Commands/Games/anime.js';
import { getLang } from '../Utils/lang.js';
import { commandLog } from '../Utils/commandLog.js';

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (!interaction.isButton()) return;
            if (!interaction.guild) return;
            const {customId} = interaction;
            const correctAnswer = customId.startsWith(`correct_`);
            const interactionID = interaction.message.interaction.id;
            const incorrectAnswer = customId.startsWith(`r_anime_`);
            if (!(correctAnswer || incorrectAnswer)) return;
            if (!commandLog("animeHandle", interaction, 1)) return;
            const lang = await getLang(interaction);
            const local = lang.anime;
            if (interaction.message.interaction.user.id !== interaction.user.id) return await interaction.reply({
                content: lang.error.notyourcommand,
                ephemeral: true
            });
            clearTimer(interactionID);

            const userAvatar = interaction.user.displayAvatarURL();
            const correctAnime = interaction.message.components[0].components.find(button => button.customId.startsWith(`correct_`));
            const correctAnimeName = correctAnime.data.label;

            const updateEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
            if (correctAnswer) {
                updateEmbed.setColor(`#00a800`);
                updateEmbed.setFooter({text: `${local.correct} - ${correctAnimeName}`, iconURL: userAvatar});
            } else if (incorrectAnswer) {
                updateEmbed.setColor(`#ff002f`);
                updateEmbed.setFooter({text: `${local.incorrect} - ${correctAnimeName}`, iconURL: userAvatar});
            }
            await interaction.message.edit({embeds: [updateEmbed], components: []});
        } catch (e) {
            console.error(e);
        }
    }
}
