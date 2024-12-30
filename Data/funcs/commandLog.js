let usedCommandsCount = 0;
const commandSendTime = 1000 * 60 * 15;
const blacklist = require('../jsons/blacklist.json');
const {updateUsedCommandsCount} = require("./dbStats");

const commandLog = (commandName, interaction) => {
    const {user} = interaction;
    if (blacklist.includes(user.id)) return false;

    usedCommandsCount++;
    console.log(`User "${user.username}" - use command: /${commandName}`);
    return true;
}

setInterval(async () => {
    try {
        if (await updateUsedCommandsCount(usedCommandsCount)) {
            console.log(`Used commands count ${usedCommandsCount} sent to DB`);
            usedCommandsCount = 0;
        } else {
            console.error(`Used commands count ${usedCommandsCount} not sent to DB`);
        }
    } catch (err) {
        console.error('Error updating used commands count:', err);
    }
}, commandSendTime);

module.exports = {commandLog};