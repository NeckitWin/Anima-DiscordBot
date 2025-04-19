import {sqlPost, sqlGet} from "./db.js";

const getServer = async (serverId) => {
    const sql = `SELECT * FROM servers WHERE serverId = ?`
    return await sqlGet(sql, [serverId]);
}

const addServer = async (serverId, serverName) => {
    await sqlPost(`INSERT INTO servers (serverId, name) VALUES (?, ?)`, [serverId, serverName]);
}

const updateServer = async (serverId, column, data) => {
    const sql = `UPDATE servers SET ${column} = ? WHERE serverId = ?`;
    await sqlPost(sql, [data, serverId]);
}

export {getServer, addServer, updateServer};