const mysql = require("mysql");
const config = require("../config.json");

const getConnection = () => {
    const conn = mysql.createConnection({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: "anima"
    });

    conn.connect(err => {
        if (err) console.error(err);
    });

    conn.on(`error`, (err)=>{
        if (err.code === `PROTOCOL_CONNECTION_LOST`) {
            console.error(err);
            getConnection();
        } else throw err;
    });

    return conn;
};

const getUser = (user_id) => {
    return new Promise((resolve, reject) => {
        const conn = getConnection();
        const sql = `SELECT userID FROM users WHERE users.userID = ?`;
        conn.query(sql, [user_id], (err, res) => {
            if (err) reject(err);

            if (res.length > 0) resolve(true);
            else resolve(false);
            conn.end();
        })
    })
};

const getUserServer = (user_id, server_id) => {
    return new Promise((resolve, reject) => {
        const conn = getConnection();
        const sql = `SELECT * FROM users JOIN wallet ON users.userID = wallet.userID WHERE wallet.userID = ? AND wallet.serverID = ?`;

        conn.query(sql, [user_id, server_id], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
        conn.end();
    })
};

const getLeaderboard = (server_id) => {
    return new Promise((resolve, reject) => {
        const conn = getConnection();
        const sql = `SELECT wallet.serverName, wallet.aura FROM wallet WHERE serverID = ? ORDER BY wallet.aura DESC`;
        conn.query(sql, [server_id], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
        conn.end();
    })
};

const postNewUser = (user_id, server_id, username, servername) => {
    return new Promise((resolve, reject) => {
        const conn = getConnection();
        const sqlBaseData = `INSERT INTO users (userID, username) VALUES (?, ?)`;
        const sqlGuildData = `INSERT INTO wallet (userID, serverID, serverName) VALUES (?, ?, ?)`;
        conn.query(sqlBaseData, [user_id, username], (err, res) => {
            if (err) reject(err);
            else conn.query(sqlGuildData, [user_id, server_id, servername], (err, res) => {
                if (err) reject(err);
                conn.end();
            })
        })
    })
};

const updateAura = async (user_id, server_id, sign, count, servername) => {
    return new Promise(async (resolve, reject) => {
        const conn = getConnection();
        try {
            const ifUserHasWallet = await getUserServer(user_id, server_id);
            const sqlUpdateAura = `UPDATE wallet SET aura=aura${sign}? WHERE serverID = ? AND userID = ?`;
            const sqlCreateWallet = `INSERT INTO wallet (userID, serverID, serverName) VALUES (?,?,?)`;

            if (ifUserHasWallet.length > 0) {
                conn.query(sqlUpdateAura, [count, server_id, user_id], (err, res) => {
                    if (err) reject(err);
                    else resolve();
                })
            } else {
                conn.query(sqlCreateWallet, [user_id, server_id, servername], (err, res) => {
                    if (err) reject(err);
                    else resolve();
                })
            }
        } catch (e) {
            console.error(e);
        } finally {
            conn.end();
        }
    })
}

module.exports = {getConnection, getUser, getUserServer, getLeaderboard, postNewUser, updateAura};