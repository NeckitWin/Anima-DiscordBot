import {sqlGet, sqlPost} from "./db.js";
import {addUserWallet, userWalletExists} from "./walletRepository.js";


const updateShards = async (userId, serverId, sign, count, username, displayName) => {
    if (!await userWalletExists(userId, serverId)) await addUserWallet(userId, serverId, username, displayName);
    const query = `UPDATE wallet SET shards=shards${sign}? WHERE serverId = ? AND userId = ?`;
    return await sqlPost(query, [count, serverId, userId]);
};

const getShardsList = async (serverId) => {
    const sql = `SELECT wallet.displayName, wallet.shards FROM wallet WHERE serverId = ? ORDER BY wallet.shards DESC`;
    const res = await sqlGet(sql, [serverId]);
    if (res.length > 0) return res;
};

const addShards = async (userId, serverId, username, displayName, shardsCount) => {
    if (!await userWalletExists(userId, serverId)) await addUserWallet(userId, serverId, username, displayName);
    const sql = `UPDATE wallet SET shards=shards+?  WHERE serverId = ? AND userId = ?`;
    await sqlPost(sql, [shardsCount, serverId, userId]);
}

export {updateShards, getShardsList, addShards};