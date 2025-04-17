import {EmbedBuilder} from "discord.js";
import {updateServerCount} from "../Utils/commandLog.js";

export default {
    name: 'reboot',
    description: 'Reboot the bot',
    async execute(message) {
        if (message.author.id != '429562004399980546') return;

        const embed = new EmbedBuilder()
            .setTitle(`<a:loading:1295096250609172611> Рестарчусь...`)
            .setColor(`#00ff97`);

        await updateServerCount();
        await message.reply({embeds: [embed]}).then(() => {
            console.log('Stop system work!')
            process.exit(0);
        })
    }
}