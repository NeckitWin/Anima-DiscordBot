import {sqlPost, sqlGet} from "./db.ts";

const getUser = async (userId) => {
    const sql = `SELECT userId FROM users WHERE users.userId = ?`;
    return await sqlGet(sql, [userId]);
};

const   userExists = async (userId) => {
    const data = await getUser(userId);
    return data.length > 0;
};

const addUser = async (userId, username) => {
    const sql = `INSERT INTO users (userId, username) VALUES (?, ?)`;
    await sqlPost(sql, [userId, username]);
};

const updateUser = async (userId, username, column, data) => {
    const sql = `UPDATE users SET ${column} = ? WHERE userId = ?`;
    if (!await userExists(userId)) await addUser(userId, username);
    await sqlPost(sql, [data, userId]);
};

export {getUser, userExists, addUser, updateUser};