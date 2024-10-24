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

module.exports = {getUser, getUserServer, getLeaderboard, postNewUser, updateAura};