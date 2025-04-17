import blacklist from '../Data/jsons/blacklist.json' with {type: 'json'};
import {updateUsedCommandsCount} from "../Repo/dbStats.js";
import {Webhooks} from "../Config/Webhooks.js";

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
        increment: () => {
            count++;
        },
        reset: () => {
            count = 0;
        },
        getCount: () => count
    };
})();

const data = {
    usedCommands: commandCounter.getCount(),
    servers: 0,
    users: 0
}

const commandLog = async (name, interaction, type = 0) => {
    const {user, author, guild} = interaction;
    const stateUser = user || author;
    const typeAction = getType(type);
    const servers = interaction.client.guilds.cache.size;
    const users = interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    data.servers = servers;
    data.users = users;
    if (stateUser && isBlacklisted(stateUser.id)) return false;
    if (guild) {
        if (isBlacklisted(guild.id)) return false;
    }
    await Webhooks.CommandsHandler.send(`${guild ? `Server: ${guild.name} | ` : ""}${stateUser ? `User "${stateUser.username}" | ` : ""}${typeAction}: ${name}`);

    if (type === commandType.COMMAND) commandCounter.increment();
    return true;
}

const sendUsedCommandsCount = async () => {
    try {
        const count = commandCounter.getCount();
        if (count === 0) return;
        if (await updateUsedCommandsCount(data)) {
            await Webhooks.CommandsHandler.send(`Used commands count ${count} sent to DB`);
            commandCounter.reset();
        } else {
            console.error(`Used commands count ${count} not sent to DB`);
        }
    } catch (err) {
        console.error('Error updating used commands count:', err);
    }
}

const updateServerCount = async () => {
    try {
        if (await updateUsedCommandsCount(data)) {
            commandCounter.reset();
        } else {
            console.error(`Update server count not sent to DB`);
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

export {commandLog, sendUsedCommandsCount, updateServerCount};