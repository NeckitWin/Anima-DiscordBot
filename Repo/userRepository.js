import {sqlPost, sqlGet} from "./db.js";

const getUser = async (userId) => {
    const sql = `SELECT userId FROM users WHERE users.userId = ?`;
    return await sqlGet(sql, [userId]);
};

const getUserServer = async (userId, serverId) => {
    const sql = `SELECT * FROM users JOIN wallet ON users.userId = wallet.userId WHERE wallet.userId = ? AND wallet.serverId = ?`;
    return await sqlGet(sql, [userId, serverId]);
};

const userExists = async (userId) => {
    const data = await getUser(userId);
    return data.length > 0;
};

const userServerExists = async (userId, serverId) => {
    const data = await getUserServer(userId, serverId);
    return data.length > 0;
}

const addUser = async (userId, username) => {
    const sql = `INSERT INTO users (userId, username) VALUES (?, ?)`;
    await sqlPost(sql, [userId, username]);
};

const addUserServer = async (userId, serverId, serverName) => {
    if (await userExists(userId)) {
        const sql = `INSERT INTO wallet (userId, serverId, serverName) VALUES (?, ?, ?)`;
        await sqlPost(sql, [userId, serverId, serverName]);
    } else {
        await addUser(userId, serverName);
        const sql = `INSERT INTO wallet (userId, serverId, serverName) VALUES (?, ?, ?)`;
        await sqlPost(sql, [userId, serverId, serverName]);
    }
};

const updateUser = async (userId, column, data) => {
    if (await userExists(userId)) {
        const sql = `UPDATE users SET ${column} = ? WHERE userId = ?`;
        await sqlPost(sql, [data, userId]);
    } else {
        await addUser(userId, data);

    }
}

export {getUser, getUserServer, addUser, addUserServer};