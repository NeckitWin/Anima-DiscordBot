import { sqlGet, sqlPost } from "./db.ts";
const getRelation = async (serverId, userId) => {
    const sql = `SELECT * FROM relation WHERE serverId = ? AND (userId1 = ? OR userId2 = ?)`;
    return await sqlGet(sql, [serverId, userId, userId]);
};
const setRelation = async (serverId, userId1, userId2) => {
    const checkRelation = await getRelation(serverId, userId1);
    if (checkRelation.length > 0)
        return false;
    const sql = `INSERT INTO relation (serverId, userId1, userId2) VALUES (?, ?, ?)`;
    await sqlPost(sql, [serverId, userId1, userId2]);
    return true;
};
const removeRelation = async (serverId, userId) => {
    const sql = `DELETE FROM relation WHERE serverId = ? AND (userId1 = ? OR userId2 = ?)`;
    await sqlPost(sql, [serverId, userId, userId]);
    return true;
};
export { getRelation, setRelation, removeRelation };
