const {EmbedBuilder} = require("discord.js");
module.exports = {
    name: 'reboot',
    description: 'Reboot the bot',
    execute(message) {
        if (message.author.id != '429562004399980546') return;

        const embed = new EmbedBuilder()
            .setTitle(`<a:loading:1295096250609172611> Рестарчусь...`)
            .setColor(`#00ff97`);

        message.reply({embeds: [embed]}).then(() => {
            process.exit(1);
        });
    }
}