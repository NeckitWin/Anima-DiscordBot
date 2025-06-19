import { sqlGet, sqlPost } from "./db.js";
import { addUserWallet, userWalletExists } from "./walletRepository.js";
const updateAura = async (userId, serverId, sign, count, displayName, username) => {
    if (!await userWalletExists(userId, serverId))
        await addUserWallet(userId, serverId, username, displayName);
    const sqlUpdateAura = `UPDATE wallet SET aura=aura${sign}? WHERE serverId = ? AND userId = ?`;
    return await sqlPost(sqlUpdateAura, [count, serverId, userId]);
};
const getAuraList = async (serverId) => {
    const sql = `SELECT wallet.displayName, wallet.aura FROM wallet WHERE serverId = ? ORDER BY wallet.aura DESC`;
    const res = await sqlGet(sql, [serverId]);
    if (res.length > 0)
        return res;
};
export { updateAura, getAuraList };
