import {sqlPost, sqlRequest} from "./db.js";

const postNewServer = async (server_id, server_name) => {
    await sqlPost(`INSERT INTO servers (serverID, serverName) VALUES (?, ?)`, [server_id, server_name]);
}

const getServer = async (server_id, server_name) => {
    try {
        const sql = `SELECT * FROM servers WHERE serverID = ?`
        let res = await sqlRequest(sql, [server_id]);
        if (res.length > 0) {
            return res[0];
        } else {
            await postNewServer(server_id, server_name);
            res = await sqlRequest(sql, [server_id]);
            return res[0];
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const updateServer = async (server_id, column, data) => {
    const sql = `UPDATE servers SET ${column} = ? WHERE serverID = ?`;
    await sqlPost(sql, [data, server_id]);
}

export {postNewServer, getServer, updateServer};