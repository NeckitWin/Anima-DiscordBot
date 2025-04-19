import {sqlGet, sqlPost} from "./db.js";

const updateAura = async (user_id, server_id, sign, count, servername, username) => {
    const sqlUpdateAura = `UPDATE wallet SET aura=aura${sign}? WHERE serverID = ? AND userID = ?`;
    return await sqlPost(sqlUpdateAura, [count, server_id, user_id]);
};

const getLeaderboard = async (serverId) => {
    const sql = `SELECT wallet.serverName, wallet.aura FROM wallet WHERE serverId = ? ORDER BY wallet.aura DESC`;
    const res = await sqlGet(sql, [serverId]);
    if (res.length > 0) {
        return res;
    }
};

export {updateAura, getLeaderboard};