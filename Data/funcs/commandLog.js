const blacklist = require('../jsons/blacklist.json');
const {updateUsedCommandsCount} = require("./dbStats");

const commandSendTime = 1000 * 60 * 20; // 20 min

const blacklistSet = new Set(blacklist);

const isBlacklisted = (id) => blacklistSet.has(id);

const commandType = Object.freeze({
    COMMAND: 0,
    EVENT: 1,
    AI: 2
});

const typeMap = {
    [commandType.COMMAND]: 'uc',
    [commandType.EVENT]: 'ue',
    [commandType.AI]: 'uai'
};

const getType = (type) => typeMap[type] || 'Unknown';

const commandCounter = (() => {
    let count = 0;

    return {
        increment: () => { count++; },
        reset: () => { count = 0; },
        getCount: () => count
    };
})();

const commandLog = (name, interaction, type = 0) => {
    const {user, author, guild} = interaction;
    const stateUser = user || author;
    const typeAction = getType(type);
    if (stateUser && isBlacklisted(stateUser.id)) return false;
    if (guild) {
        if (isBlacklisted(guild.id)) return false;
    }
    console.log(`${guild ? `Server: ${guild.name} | ` : ""}${stateUser ? `User "${stateUser.username}" | ` : ""}${typeAction}: ${name}`);

    if (type === commandType.COMMAND) commandCounter.increment();
    return true;
}

const sendUsedCommandsCount = async () => {
    try {
        const count = commandCounter.getCount();
        if (count === 0) return;
        if (await updateUsedCommandsCount(count)) {
            console.log(`Used commands count ${count} sent to DB`);
            commandCounter.reset();
        } else {
            console.error(`Used commands count ${count} not sent to DB`);
        }
    } catch (err) {
        console.error('Error updating used commands count:', err);
    }
}
const startCommandCountSync = async () => {
    await sendUsedCommandsCount();
    setTimeout(startCommandCountSync, commandSendTime);
};

setTimeout(startCommandCountSync, commandSendTime);

module.exports = {commandLog, sendUsedCommandsCount};