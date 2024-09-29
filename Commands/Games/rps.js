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
        .setName(`rps`)
        .setDescription(`Rock, Paper, Scissors game`)
        .addUserOption(option => option
            .setName(`user`)
            .setDescription(`choose a user you want to play the game with`)
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