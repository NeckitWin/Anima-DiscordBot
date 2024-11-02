const {sqlRequest, sqlPost} = require(`./db`)

// functions
const getUser = async (user_id) => {
    const sql = `SELECT userID FROM users WHERE users.userID = ?`;
    const res = await sqlRequest(sql, [user_id]);
    return res.length > 0; // true or false
};

const getUserServer = async (user_id, server_id) => {
    const sql = `SELECT * FROM users JOIN wallet ON users.userID = wallet.userID WHERE wallet.userID = ? AND wallet.serverID = ?`;
    return await sqlRequest(sql, [user_id, server_id]);
};

const getLeaderboard = async (server_id) => {
    const sql = `SELECT wallet.serverName, wallet.aura FROM wallet WHERE serverID = ? ORDER BY wallet.aura DESC`;
    const res = await sqlRequest(sql, [server_id]);
    if (res.length > 0) {
        return res;
    }
};

const postNewUser = async (user_id, server_id, username, servername) => {
    const sqlBaseData = `INSERT INTO users (userID, username) VALUES (?, ?)`;
    const sqlGuildData = `INSERT INTO wallet (userID, serverID, serverName) VALUES (?, ?, ?)`;
    const isUserDB = await getUser(user_id);
    const isUserServer = await getUserServer(user_id, server_id);

    if (!isUserDB) {
        await sqlPost(sqlBaseData, [user_id, username]);
        await sqlRequest(sqlGuildData, [user_id, server_id, servername]);
    } else if (isUserDB && !isUserServer.length>0) {
        await sqlPost(sqlGuildData, [user_id, server_id, servername]);
    } else return true;
};

const updateAura = async (user_id, server_id, sign, count, servername, username) => {
    const ifUserHasWallet = await getUserServer(user_id, server_id);
    const sqlUpdateAura = `UPDATE wallet SET aura=aura${sign}? WHERE serverID = ? AND userID = ?`;

    if (ifUserHasWallet.length>0) {
        await sqlPost(sqlUpdateAura, [count, server_id, user_id]);
    } else {
        await postNewUser(user_id, server_id, username, servername).then(async ()=>{
            await sqlPost(sqlUpdateAura, [count, server_id, user_id]);
        })
    }
}

const getRelation = async (server_id, user_id) => {
    const sql = `SELECT * FROM relation WHERE serverID = ? AND (userID1 = ? OR userID2 = ?)`;
    return await sqlRequest(sql, [server_id, user_id, user_id]);
};

const setRelation = async (server_id, user_id1, user_id2) => {
    const checkRelation = await getRelation(server_id, user_id1);
    if (checkRelation.length > 0) return false;
    const sql = `INSERT INTO relation (serverID, userID1, userID2) VALUES (?, ?, ?)`;
    await sqlPost(sql, [server_id, user_id1, user_id2]);
    return true;
};

const removeRelation = async (server_id, user_id) => {
    const sql = `DELETE FROM relation WHERE serverID = ? AND (userID1 = ? OR userID2 = ?)`;
    await sqlPost(sql, [server_id, user_id, user_id]);
    return true;
}

module.exports = {getUser, getUserServer, getLeaderboard, postNewUser, updateAura, getRelation, setRelation, removeRelation};