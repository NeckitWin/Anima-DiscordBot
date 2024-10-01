const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require(`discord.js`)
const {getCooldown} = require("../../Data/funcs/cooldown");

const buttonAccept = new ButtonBuilder()
    .setCustomId(`rpsAccept`)
    .setEmoji(`👍`)
    .setStyle(ButtonStyle.Success);

const buttonDecline = new ButtonBuilder()
    .setCustomId(`rpsDecline`)
    .setEmoji(`👎`)
    .setStyle(ButtonStyle.Danger);

const row = new ActionRowBuilder().addComponents(buttonAccept, buttonDecline);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`rock-paper-scissors`)
        .setNameLocalizations({ru: `камень-ножницы-бумага`, pl: `kamień-papier-nożyce`, uk: `камінь-ножиці-папір`})
        .setDescription(`Play a game of Rock, Paper, Scissors with a user`)
        .setDescriptionLocalizations({
            ru: `Сыграйте в игру Камень, Ножницы, Бумага с пользователем`,
            pl: `Zagraj w grę Kamień, Papier, Nożyce z użytkownikiem`,
            uk: `Зіграйте в гру Камінь, Ножиці, Папір з користувачем`
        })
        .addUserOption(option => option
            .setName(`user`)
            .setNameLocalizations({ru: `пользователь`, pl: `użytkownik`, uk: `користувач`})
            .setDescription(`Choose a user you want to play the game with`)
            .setDescriptionLocalizations({
                ru: `Выберите пользователя, с которым хотите сыграть в игру`,
                pl: `Wybierz użytkownika, z którym chcesz zagrać w grę`,
                uk: `Виберіть користувача, з яким хочете зіграти в гру`
            })
            .setRequired(true)),
    async execute(interaction) {
        if (await getCooldown('rps', interaction, interaction.user.id, 30)) return;
        if (interaction.user.id !== 429562004399980546) return interaction.reply({content: `In development`, ephemeral: true});

        const target = interaction.options.getUser(`user`);
        const embed = new EmbedBuilder()
            .setTitle(`Rock, Paper, Scissors!`)
            .setDescription(`Do you want to play a game with the user ${interaction.user}?`)
            .setColor(`#288444`)
            .setImage(`https://i.imgur.com/eSKNwQH.gif`);

        await interaction.reply({content: `${target}`, embeds:[embed], components: [row]});
    }
}