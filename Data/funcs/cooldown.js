const timeout = new Set();

const getCooldown = async (message, userID, time) => {
    const seconds = time*1000;

    if (timeout.has(userID)) {
        return await message.reply({ content: `Please wait ${(time>60) ? `${parseInt(time/60)} minutes` : `${time} seconds`}`, ephemeral: true });
    }

    timeout.add(userID);
    setTimeout(() => {
        timeout.delete(userID);
    }, seconds);
};

module.exports = { getCooldown };