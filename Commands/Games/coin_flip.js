const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {getLang} = require("../../Data/Lang");

const coinGifs = [
    "https://media.tenor.com/dexjLvFk3_MAAAAM/misaka-mikoto-misaka.gif",
    "https://www.kiddiepunk.com/zacsdrugbinge/images/3.gif",
    "https://media.tenor.com/mJOTJmC_LMsAAAAM/coin-throw.gif",
    "https://i.pinimg.com/originals/c8/0c/fb/c80cfb332618bcec4927936d8553095d.gif",
    "https://media.tenor.com/-Ty-f7Ld7skAAAAM/anime-coinflip.gif",
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
            .setRequired(true)
            .addChoices(
                {name: 'Heads', name_localizations: {ru: 'Орёл', pl: 'Orzeł', uk: 'Орел'}, value: 'heads'},
                {name: 'Tails', name_localizations: {ru: 'Решка', pl: 'Reszka', uk: 'Решка'}, value: 'tails'}
            )),
    async execute(interaction) {
        const lang = await getLang(interaction);
        const local = lang.coin;

        const side = interaction.options.getString('side');
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const randomGif = parseInt(Math.random() * coinGifs.length);
        const gif = coinGifs[randomGif];

        const embed = new EmbedBuilder()
            .setTitle(local.title)
            .setDescription(local.coinup)
            .setColor("#b38a00")
            .setFooter({text: `${local.choice} ${local[side]}`, iconURL: interaction.user.avatarURL()})
            .setImage(gif);

        await interaction.reply({embeds: [embed]});

        const embedWin = new EmbedBuilder()
            .setTitle(local.title)
            .setImage(gif)
            .setFooter({text: interaction.user.displayName, iconURL: interaction.user.avatarURL()});

        if (side === result) {
            embedWin.setColor("#4dffb3");
            embedWin.setDescription(`${local.win} ${local[result]}`);
        } else {
            embedWin.setColor("#ff4d4d");
            embedWin.setDescription(`${local.lose} ${local[result]}`);
        }

        setTimeout(()=>{
            interaction.editReply({embeds: [embedWin]});
        }, [3*1000]) // seconds
    }
};