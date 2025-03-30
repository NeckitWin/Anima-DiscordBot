const {sqlPost, sqlRequest} = require(`./db`);

const getGreet = async (server_id) => {
    const sql = `SELECT * FROM greet WHERE serverID = ?`;
    return await sqlRequest(sql, [server_id]);
}

const updateGreet = async (server_id, title, content, picture, channel_id) => {
    const isExist = await getGreet(server_id);
    if (isExist.length > 0) {
        await sqlPost(`UPDATE greet SET title = ?, content = ?, picture = ?, channelID = ? WHERE serverID = ?`, [title, content, picture, channel_id, server_id]);
    } else {
        await sqlPost(`INSERT INTO greet (serverID, title, content, picture, channelID) VALUES (?, ?, ?, ?, ?)`, [server_id, title, content, picture, channel_id]);
    }
}

const removeGreet = async (server_id) => {
    await sqlPost(`DELETE FROM greet WHERE serverID = ?`, [server_id]);
}

module.exports = {getGreet, updateGreet, removeGreet};