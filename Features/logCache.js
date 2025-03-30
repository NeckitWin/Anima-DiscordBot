import {getServer} from "./dbServer.js";
const logCache = new Map();

const ifServerHasLog = async (guildId, guildName) => {
    if (logCache.has(guildId)) {
        return logCache.get(guildId);
    } else {
            const server = await getServer(guildId, guildName);
            if (server.logs != false) {
                logCache.set(guildId, server.logs);
                return server.logs;
            } else {
                logCache.set(guildId, false);
                return false;
            }
    }
}

const clearLogCache = (guildId) => {
    logCache.delete(guildId);
}

export {ifServerHasLog, clearLogCache};