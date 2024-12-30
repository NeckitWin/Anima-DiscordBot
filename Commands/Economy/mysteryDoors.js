const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require(`discord.js`);
const {commandLog} = require("../../Data/funcs/commandLog");
const commandName = 'mystery-doors';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(`Open one of the doors and get a prize!`)
        .setNameLocalizations({
            ru: `тайные-двери`,
            pl: `tajemnicze-drzwi`,
            uk: `таємні-двері`
        })
        .setDescriptionLocalizations({
            ru: `Откройте одну из дверей и получите приз!`,
            pl: `Otwórz jedne z drzwi i wygraj nagrodę!`,
            uk: `Відкрийте одні з дверей і отримайте приз!`
        }),
    async execute(interaction) {
        if (!commandLog(commandName, interaction)) return;

        const embed = new EmbedBuilder()
            .setTitle(`Mystery doors`)
            .setDescription(`Choose one of the doors below and get a prize!`)
            .setColor(`#00ffc5`)
            .setImage(`https://i.pinimg.com/736x/09/68/75/096875cb8a0c59c2c9cd74cab2a5282a.jpg`);

        const buttonOne = new ButtonBuilder()
            .setCustomId(`door_1`)
            .setLabel(`Door 1`)
            .setEmoji(`🚪`)
            .setStyle(`Success`);

        const buttonTwo = new ButtonBuilder()
            .setCustomId(`door_2`)
            .setLabel(`Door 2`)
            .setEmoji(`🚪`)
            .setStyle(`Success`);

        const buttonThree = new ButtonBuilder()
            .setCustomId(`door_3`)
            .setLabel(`Door 3`)
            .setEmoji(`🚪`)
            .setStyle(`Success`);

        const row = new ActionRowBuilder()
            .addComponents(buttonOne, buttonTwo, buttonThree);

        await interaction.reply({embeds: [embed], components: [row]});
    }
}