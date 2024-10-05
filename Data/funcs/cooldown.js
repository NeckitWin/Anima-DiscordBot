const {getLang} = require("../Lang");
const timeout = new Set();

const getCooldown = async (commandEvent, message, time) => {
    const userID = message.author.id;

    const lang = await getLang(message);
    const local = lang.error;

    const seconds = time*1000;
    const key = `${userID}-${message.guild.id}-${commandEvent}`

    if (timeout.has(key)) {
        return await message.reply({ content: `${local.wait} ${(time>60) ? `${parseInt(time/60)} ${local.minutes}` : `${time} ${local.seconds}`}`, ephemeral: true });
    }

    timeout.add(key);
    setTimeout(() => {
        timeout.delete(key);
    }, seconds);
};

module.exports = { getCooldown };