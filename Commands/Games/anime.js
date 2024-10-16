const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require(`discord.js`);
const anime = require(`../../Data/jsons/anime.json`);
const {getLang} = require("../../Data/Lang");

const timers = new Map();

const getRandomAnime = () => { return anime[Math.floor(Math.random() * anime.length)] };

const clearTimer = (interactionId) => {
    const timeoutID = timers.get(interactionId);
    if (timeoutID) {
        clearTimeout(timeoutID);
        timers.delete(interactionId);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription(`Guess the anime by the picture`)
        .setNameLocalizations({ru: `аниме`, pl: `anime`, uk: `аниме`})
        .setDescriptionLocalizations({
            ru: `Угадай аниме по картинке`,
            pl: `Zgadnij anime po obrazku`,
            uk: `Вгадай аніме за зображенням`
        }),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const lang = await getLang(interaction);
            const local = lang.anime;

            const correctAnime = getRandomAnime();
            const randomGif = correctAnime.gif[Math.floor(Math.random() * correctAnime.gif.length)];
            const buttons = [];
            const userAvatar = interaction.user.displayAvatarURL();
            const embed = new EmbedBuilder()
                .setTitle(`${local.guess}!`)
                .setColor(`#ffd1dd`)
                .setFooter({text: local.time, iconURL: interaction.user.displayAvatarURL()})
                .setImage(randomGif);

            const correctButton = new ButtonBuilder()
                .setCustomId(`correct_${correctAnime.name}_${interaction.id}`)
                .setLabel(local.titles[correctAnime.name])
                .setStyle(ButtonStyle.Secondary);

            buttons.push(correctButton);
            while (buttons.length < 4) {
                const randomAnime = getRandomAnime();
                if (!buttons.some(button => button.data.label === local.titles[randomAnime.name])) {
                    const button = new ButtonBuilder()
                        .setCustomId(`r_anime_${randomAnime.name}`)
                        .setLabel(local.titles[randomAnime.name])
                        .setStyle(ButtonStyle.Secondary);

                    buttons.push(button);
                }
            }

            const sortButtons = buttons.sort(() => Math.random() - 0.5);
            const row = new ActionRowBuilder().addComponents(sortButtons);

            await interaction.editReply({embeds: [embed], components: [row]});

            const timeoutID = setTimeout(async () => {
                try {
                    embed.setColor(`#ff002f`);
                    embed.setFooter({text: local.time_over, iconURL: userAvatar});
                    await interaction.editReply({embeds: [embed], components: []});
                    timers.delete(interaction.id);
                } catch (e) {
                    console.error(e);
                }
            }, 15 * 1000);

            timers.set(interaction.id, timeoutID);
        } catch (e) {
            console.error(e);
        }
    },
    clearTimer
}
