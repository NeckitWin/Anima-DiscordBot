const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require(`discord.js`);
const {getRelation} = require("../../Data/funcs/dbUser");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`relation`)
        .setNameLocalizations({ru: `отношения`, pl: `relacje`, uk: `відносини`})
        .setDescription(`Start a relationship with someone`)
        .setDescriptionLocalizations({
            ru: `Начните отношения с кем-то`,
            pl: `Zacznij związek z kimś`,
            uk: `Почніть відносини з кимось`
        })
        .addUserOption(option =>
            option.setName(`user`)
                .setNameLocalizations({ru: `пользователь`, pl: `użytkownik`, uk: `користувач`})
                .setDescription(`Choose the user to start a relationship`)
                .setDescriptionLocalizations({
                    ru: `Выберите пользователя для начала отношений`,
                    pl: `Wybierz użytkownika, z którym chcesz zacząć związek`,
                    uk: `Виберіть користувача для початку відносин`
                })
                .setRequired(false)),
    async execute(interaction) {
        try {
            if (interaction.user.id != `429562004399980546`) return interaction.reply(`In development | В разработке | W trakcie opracowywania | В розробці`);
            const mentionUser = interaction.options.getUser(`user`);
            if (mentionUser.bot) return interaction.reply(`Вы не можете начать отношения с ботом`);

            const embedError = new EmbedBuilder()
                .setColor(`#c30000`)

            if (mentionUser) {
                if (mentionUser.id === interaction.user.id) {
                    embedError.setTitle(`Вы не можете начать отношения с собой`);
                    return interaction.reply({embeds: [embedError]});
                }

                const embed = new EmbedBuilder()
                    .setTitle(`Свадьба`)
                    .setDescription(`${interaction.user.displayName} сделал вам предложение руки и сердца`)

                const ButtonAccept = new ButtonBuilder()
                    .setLabel(`Принять`)
                    .setStyle(`Success`)
                    .setCustomId(`acceptRelation`);

                const ButtonDecline = new ButtonBuilder()
                    .setLabel(`Отклонить`)
                    .setStyle(`Primary`)
                    .setCustomId(`declineRelation`);

                const ActionRow = new ActionRowBuilder()
                    .addComponents(ButtonAccept, ButtonDecline);

                interaction.reply({content: `${mentionUser}`, embeds: [embed], components: [ActionRow]});
            } else {
                const checkRelation = await getRelation(interaction.guild.id, interaction.user.id);
                if (!checkRelation.length > 0) return interaction.reply(`Вы не в отношениях`);
                const relation = checkRelation[0];
                const embed = new EmbedBuilder()

                console.log(relation)
                interaction.reply(`test`);
            }
        } catch (err) {
            console.error(err);
        }
    }
}