const {SlashCommandBuilder, ModalBuilder} = require(`discord.js`);

const modal = new ModalBuilder().setTitle(`test`)
    .setCustomId(`myModal`)
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`greeting`)
        .setNameLocalizations({ru: `приветствие`, pl: `powitanie`, uk: `привітання`})
        .setDescription(`Set channel for greeting new members`)
        .setDescriptionLocalizations({
            ru: `Установить канал для приветствия новых участников`,
            pl: `Ustaw kanał dla powitania nowych członków`,
            uk: `Встановити канал для привітання нових учасників`
        }),
    async execute(interaction) {
        if (interaction.user.id !== "429562004399980546") return await interaction.reply({content: `in development`, ephemeral: true})
        await interaction.showModal(modal);
    }
}