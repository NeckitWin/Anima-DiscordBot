import {sqlGet, sqlPost} from "./db.js";
import {addUser, userExists} from "./userRepository.js";

const getUserWallet = async (userId, serverId) => {
    const sql = `SELECT * FROM wallet WHERE wallet.userId = ? AND wallet.serverId = ?`;
    return await sqlGet(sql, [userId, serverId]);
};

const userWalletExists = async (userId, serverId) => {
    const data = await getUserWallet(userId, serverId);
    return data.length > 0;
};

const addUserWallet = async (userId, serverId, username, displayName) => {
    if (!await userExists(userId))  await addUser(userId, username);
    const sql = `INSERT INTO wallet (userId, serverId, displayName) VALUES (?, ?, ?)`;
    await sqlPost(sql, [userId, serverId, displayName]);
};

const updateUserWallet = async (userId, serverId, username, displayName, column, data) => {
    const sql = `UPDATE wallet SET ${column} = ? WHERE userId = ? AND serverId = ?`;
    if (!await userWalletExists(userId, serverId)) await addUserWallet(userId, serverId, username, displayName);
    await sqlPost(sql, [data, userId, serverId]);
};

const getSetUserWallet = async (userId, serverId, username, displayName) => {
    const res = await getUserWallet(userId, serverId);
    if (!res.length > 0) {
        await addUserWallet(userId, serverId, username, displayName);
        return await getUserWallet(userId, serverId);
    }
    return res;
};

export {getUserWallet, userWalletExists, addUserWallet, updateUserWallet};