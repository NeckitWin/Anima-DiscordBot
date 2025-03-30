const {sqlPost, sqlRequest} = require(`./db`);

const getAutoRoles = async (server_id) => {
    try {
        const sql = `SELECT * FROM autoroles WHERE serverID = ?`;
        return await sqlRequest(sql, [server_id]);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const getAutoRole = async (server_id, role_id) => {
    try {
        const sql = `SELECT * FROM autoroles WHERE serverID = ? AND roleID = ?`;
        return await sqlRequest(sql, [server_id, role_id]);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const removeAutoRole = async (server_id, role_id) => {
    try {
        await sqlPost(`DELETE FROM autoroles WHERE serverID = ? AND roleID = ?`, [server_id, role_id]);
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
        await sqlPost(`INSERT INTO autoroles (serverID, roleID) VALUES (?, ?)`, [server_id, role_id]);
        return true;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const clearAutoRoles = async (server_id) => {
    try {
        await sqlPost(`DELETE FROM autoroles WHERE serverID = ?`, [server_id])
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {getAutoRoles, getAutoRole, removeAutoRole, postAutoRole, clearAutoRoles};