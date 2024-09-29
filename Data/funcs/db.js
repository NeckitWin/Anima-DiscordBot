const mysql = require("mysql");
const config = require("../config.json");

const getConnection = () => {
    const conn = mysql.createConnection({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: "anima",
    });

    conn.connect(err => {
        if (err) console.error(err);
    });

    return conn;
}

const getUser = (user_id, server_id) => {
    return new Promise((resolve, reject) => {
        const conn = getConnection();
        const sql = `SELECT * FROM users JOIN wallet ON users.userID = wallet.userID WHERE wallet.userID = ? AND wallet.serverID = ?`;

        conn.query(sql, [user_id, server_id], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
        conn.end();
    })
}

const getLeaderboard = (server_id) => {
    return new Promise((resolve, reject)=>{
        const conn = getConnection();
        const sql = `SELECT wallet.serverName, wallet.aura FROM wallet WHERE serverID = ? ORDER BY wallet.aura DESC`;
        conn.query(sql,[server_id],(err, res)=>{
            if (err) reject(err);
            else resolve(res);
        });
        conn.end();
    })
}

module.exports = {getConnection, getUser, getLeaderboard};