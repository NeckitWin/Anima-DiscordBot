import {Webhooks} from "../Config/Webhooks.js";
import {EmbedBuilder} from "discord.js";

const errorLog = async (error) => {
    console.log(error);
    const embed = new EmbedBuilder()
        .setTitle("Error Log")
        .setDescription(JSON.stringify(error))
        .setColor("#C80000");

    await Webhooks.ErrorHandler.send({embeds: [embed]});
}

export default errorLog;