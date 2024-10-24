const mysql = require("mysql");
const config = require("../config.json");

const getConnection = () => {
    const conn = mysql.createConnection({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: "anima",
        charset: 'utf8mb4'
    });

    conn.connect(err => {
        if (err) console.error(err);
    });

    conn.on(`error`, (err) => {
        if (err.code === `PROTOCOL_CONNECTION_LOST`) {
            console.error(err);
            getConnection();
        } else throw err;
    });
    return conn;
};

const sqlRequest = async (sql, params) => {
    const conn = getConnection();
    try {
        return new Promise((resolve, reject) => {
            conn.query(sql, params, (err, res) => {
                if (err) return reject(err);
                else resolve(res);
            });
        });
    } catch (e) {
        console.error(e);
        throw e;
    } finally {
        conn.end();
    }
};

const sqlPost = async (sql, params) => {
    const conn = getConnection();
    try {
        return new Promise((resolve, reject) => {
            conn.query(sql, params, (err, res) => {
                if (err) return reject(err);
                else resolve(true);
            });
        });
    } catch (e) {
        console.error(e);
        throw e;
    } finally {
        conn.end();
    }
}

module.exports = {sqlRequest, sqlPost}