const {sdcKEY} = require('../Data/config.json');
const SDC = require("@megavasiliy007/sdc-api");
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: 'send_stats',
    description: 'Send stats for sdc',
    execute(message) {
        if (message.author.id != '429562004399980546') return;
        try {
            const embed = new EmbedBuilder()
                .setTitle(`<a:loading:1295096250609172611> Моя статистика уже в пути!`)
                .setColor(`#00ff97`);

            const sdc = new SDC(sdcKEY);
            sdc.setAutoPost(message.client);

            return message.reply({embeds: [embed]});
        } catch (err) {
            console.error(err);
        }
    }
}