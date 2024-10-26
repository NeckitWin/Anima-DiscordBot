const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

const data = require("../../Data/jsons/reaction.json")
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emote")
        .setNameLocalizations({ru: "эмоция", pl: "emocja", uk: "емоція"})
        .setDescription("Show your emotions")
        .setDescriptionLocalizations({
            ru: "Покажите свои эмоции",
            pl: "Pokaż swoje emocje",
            uk: "Покажіть свої емоції"
        })
        .addStringOption(option =>
            option.setName("your_reaction")
                .setNameLocalizations({ru: "ваша_реакция", pl: "twoja_reakcja", uk: "ваша_реакція"})
                .setDescription("Select your reaction")
                .setDescriptionLocalizations({
                    ru: "Выберите вашу реакцию",
                    pl: "Wybierz swoją reakcję",
                    uk: "Виберіть вашу реакцію"
                })
                .addChoices(data.reactions)
                .setRequired(true)),
    async execute(interaction) {
        const lang = await getLang(interaction);
        const local = lang.reaction;

        const target = interaction.options.getString("your_reaction");
        const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.user.displayName} ${local[target]}`, iconURL: interaction.user.displayAvatarURL()})
            .setImage(data[target][Math.floor(Math.random() * data[target].length)]);

        interaction.reply({embeds: [embed]});
    }
}