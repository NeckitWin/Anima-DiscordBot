import {sqlPost, sqlGet} from "./db.ts";

const getAutoRoles = async (server_id) => {
    try {
        const sql = `SELECT * FROM autoroles WHERE serverId = ?`;
        return await sqlGet(sql, [server_id]);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const getAutoRole = async (server_id, role_id) => {
    try {
        const sql = `SELECT * FROM autoroles WHERE serverId = ? AND roleId = ?`;
        return await sqlGet(sql, [server_id, role_id]);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const removeAutoRole = async (server_id, role_id) => {
    try {
        await sqlPost(`DELETE FROM autoroles WHERE serverId = ? AND roleId = ?`, [server_id, role_id]);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const postAutoRole = async (server_id, role_id) => {
    try {
        const role = await getAutoRole(server_id, role_id);
        if (role.length > 0) {
            return false;
        }
        await sqlPost(`INSERT INTO autoroles (serverId, roleId) VALUES (?, ?)`, [server_id, role_id]);
        return true;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const clearAutoRoles = async (server_id) => {
    try {
        await sqlPost(`DELETE FROM autoroles WHERE serverId = ?`, [server_id])
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export {getAutoRoles, getAutoRole, removeAutoRole, postAutoRole, clearAutoRoles};