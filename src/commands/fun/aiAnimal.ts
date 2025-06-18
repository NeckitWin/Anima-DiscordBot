import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import animals from "../../../data/jsons/aianimals.json" with {type: 'json'};
import errorLog from "../../utils/errorLog.ts";

export default {
    data: new SlashCommandBuilder()
        .setName("ai-animal")
        .setNameLocalizations({
            ru: "ии-животное",
            pl: "zwierzę-ii",
            uk: "іі-тварина"
        })
        .setDescription("Shows the ai brainrot animal")
        .setDescriptionLocalizations({
            ru: "Показывает животное с ИИ бредом",
            pl: "Pokazuje zwierzę z AI brednią",
            uk: "Показує тварину з ІІ бредом"
        }),
    async execute(interaction: CommandInteraction) {
        try {
            const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
            const embed = new EmbedBuilder()
                .setTitle(randomAnimal.name)
                .setImage(randomAnimal.gif);

            await interaction.reply({embeds: [embed]});
        } catch (error) {
            await errorLog(error);
        }
    }
}