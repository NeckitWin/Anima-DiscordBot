const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

const data = require("../../Data/jsons/interaction.json")
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rp")
        .setNameLocalizations({ru: "рп", pl: "rp", uk: "рп"})
        .setDescription("interaction with someone")
        .setDescriptionLocalizations({ru: "взаимодействие с кем-то", pl: "interakcja z kimś", uk: "взаємодія з кимось"})
        .addStringOption(option =>
            option.setName("your_interaction")
                .setNameLocalizations({ru: "ваше_взаимодействие", pl: "twoja_interakcja", uk: "ваша_взаємодія"})
                .setDescription("Choose your interaction")
                .setDescriptionLocalizations({ru: "Выберите ваше взаимодействие", pl: "Wybierz swoją interakcję", uk: "Виберіть вашу взаємодію"})
                .addChoices(data.interaction)
                .setRequired(true))
        .addUserOption(option =>
            option.setName("user")
                .setNameLocalizations({ru: "пользователь", pl: "użytkownik", uk: "користувач"})
                .setDescription("choose the user")
                .setDescriptionLocalizations({ru: "Выберите пользователя", pl: "Wybierz użytkownika", uk: "Виберіть користувача"})
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getString("your_interaction");
        const mentionUser = interaction.options.getUser("user");

        const lang = await getLang(interaction);
        const local = lang.interaction;

        const embed = new EmbedBuilder()
            .setAuthor({name: ` `, iconURL: interaction.user.displayAvatarURL()})
            .setDescription(`${interaction.user} ${local[target]} ${mentionUser}`)
            .setImage(data[target][Math.floor(Math.random() * data[target].length)]);

        interaction.reply({embeds: [embed]});
    }
}