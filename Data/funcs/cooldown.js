const timeout = new Set();

const getCooldown = async (commandEvent, message, userID, time) => {

    const seconds = time*1000;
    const key = `${userID}-${message.guild.id}-${commandEvent}`
    console.log(key);

    if (timeout.has(key)) {
        return await message.reply({ content: `Please wait ${(time>60) ? `${parseInt(time/60)} minutes` : `${time} seconds`}`, ephemeral: true });
    }

    timeout.add(key);
    setTimeout(() => {
        timeout.delete(key);
    }, seconds);
};

module.exports = { getCooldown };