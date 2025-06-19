import { getServer } from "../repo/serverRepository.ts";
const logCache = new Map();
const ifServerHasLog = async (guildId, guildName) => {
    if (logCache.has(guildId)) {
        return logCache.get(guildId);
    }
    else {
        const server = await getServer(guildId);
        const logs = server[0].logs;
        if (logs && logs !== 0) {
            logCache.set(guildId, logs);
            return logs;
        }
        else {
            logCache.set(guildId, false);
            return false;
        }
    }
};
const clearLogCache = (guildId) => {
    logCache.delete(guildId);
};
export { ifServerHasLog, clearLogCache };
