import {sqlPost, sqlGet} from "./db.js";

const getGreet = async (serverId) => {
    const sql = `SELECT * FROM greet WHERE serverId = ?`;
    return await sqlGet(sql, [serverId]);
}

const updateGreet = async (serverId, title, content, picture, channelId) => {
    const isExist = await getGreet(serverId);
    if (isExist.length > 0) {
        await sqlPost(`UPDATE greet SET title = ?, content = ?, picture = ?, channelId = ? WHERE serverId = ?`, [title, content, picture, channelId, serverId]);
    } else {
        await sqlPost(`INSERT INTO greet (serverId, title, content, picture, channelId) VALUES (?, ?, ?, ?, ?)`, [serverId, title, content, picture, channelId]);
    }
}

const removeGreet = async (serverId) => {
    await sqlPost(`DELETE FROM greet WHERE serverId = ?`, [serverId]);
}

export {getGreet, updateGreet, removeGreet};