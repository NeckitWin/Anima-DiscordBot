const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

const data = require("../../Data/jsons/reaction.json")
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reaction")
        .setNameLocalizations({ru: "реакция", pl: "reakcja", uk: "реакція"})
        .setDescription("react to a message")
        .setDescriptionLocalizations({
            ru: "реагируйте на сообщение",
            pl: "zareaguj na wiadomość",
            uk: "реагуйте на повідомлення"
        })
        .addStringOption(option =>
            option.setName("your_reaction")
                .setNameLocalizations({ru: "ваша_реакция", pl: "twoja_reakcja", uk: "ваша_реакція"})
                .setDescription("Put your reaction")
                .setDescriptionLocalizations({
                    ru: "Поставьте свою реакцию",
                    pl: "Wstaw swoją reakcję",
                    uk: "Поставте свою реакцію"
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