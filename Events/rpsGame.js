const {Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require(`discord.js`);

const embedDecline = new EmbedBuilder()
    .setTitle(`User decline your game request`)
    .setColor(`#e0343c`);

const embedAccept = new EmbedBuilder()
    .setTitle(`Start of the game`)
    .setDescription(`Choose rock, paper, or scissors`)
    .setColor(`#288444`)
    .setImage(`https://y.yarn.co/f7e1ae34-b3b4-4369-b81b-5ce9ec16f353_text.gif`);

const buttonRock = new ButtonBuilder()
    .setCustomId(`rpsRockButton`)
    .setEmoji(`🪨`)
    .setStyle(ButtonStyle.Primary);
const buttonPaper = new ButtonBuilder()
    .setCustomId(`rpsPaperButton`)
    .setEmoji(`◻️`)
    .setStyle(ButtonStyle.Primary);
const buttonScissors = new ButtonBuilder()
    .setCustomId(`rpsScissorsButton`)
    .setEmoji(`✂️`)
    .setStyle(ButtonStyle.Primary);
const row = new ActionRowBuilder()
    .addComponents(buttonRock, buttonPaper, buttonScissors);

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (![`rpsAccept`, `rpsDecline`].includes(interaction.customId)) return;
        const proposer = interaction.message.interaction.user;
        const acceptor = interaction.message.mentions.users.first();

        switch (interaction.customId) {
            case `rpsAccept`:
                await interaction.reply({content:`${proposer}`, embeds:[embedAccept], components:[row]})
                break;
            case `rpsDecline`:
                await interaction.message.edit({content:``, embeds:[embedDecline], components:[]})
                break;
        }
    }
}