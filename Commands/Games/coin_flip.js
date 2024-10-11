const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const gids = [
    "https://media.tenor.com/dexjLvFk3_MAAAAM/misaka-mikoto-misaka.gif",
    "https://www.kiddiepunk.com/zacsdrugbinge/images/3.gif",
    "https://media.tenor.com/mJOTJmC_LMsAAAAM/coin-throw.gif",
    "https://i.pinimg.com/originals/c8/0c/fb/c80cfb332618bcec4927936d8553095d.gif",
    "https://media.tenor.com/-Ty-f7Ld7skAAAAM/anime-coinflip.gif",
    "https://giffiles.alphacoders.com/178/178414.gif",
    "https://www.kiddiepunk.com/zacsdrugbinge/images/3.gif"
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin_flip')
        .setDescription('Flips a coin')
        .setNameLocalizations({ru: 'монетка', pl: 'rzuć_monetą', uk: 'підкинь_монету'})
        .setDescriptionLocalizations({
            ru: 'Подбрасывает монетку',
            pl: 'Rzuca monetą',
            uk: 'Підкидає монету'
        })
        .addStringOption(option => option
            .setName('side')
            .setNameLocalizations({ru: 'сторона', pl: 'strona', uk: 'сторона'})
            .setDescription('The side of the coin you want to land on')
            .setDescriptionLocalizations({
                ru: 'Сторона монетки, на которую вы хотите упасть',
                pl: 'Strona monety, na którą chcesz upaść',
                uk: 'Сторона монетки, на яку ви хочете впасти'
            })
            .setRequired(false)
            .addChoices(
                {name: 'Heads', name_localizations: {ru: 'Орёл', pl: 'Orzeł', uk: 'Орел'}, value: 'heads'},
                {name: 'Tails', name_localizations: {ru: 'Решка', pl: 'Reszka', uk: 'Решка'}, value: 'tails'}
            )),
    async execute(interaction) {
        const side = interaction.options.getString('side');
        const result = Math.random() < 0.5 ? 'heads' : 'tails';

        const embed = new EmbedBuilder()
            .setTitle(`Heads or Tails?`)
            .setDescription(`Coin landed on ...`)
            .setImage(``);

        await interaction.reply({
            content: replyMessage,
            ephemeral: true
        });

        setTimeout(()=>{
            interaction.editReply(`test`)
        }, [3*1000]) // seconds
    }
};