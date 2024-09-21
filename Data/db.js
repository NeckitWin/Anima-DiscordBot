const mysql = require("mysql");
const config = require("./config.json");

const getConnection = () => {
    const conn = mysql.createConnection({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: "anima",
    });

    conn.connect(err => {
        if (err) console.error(err);
    })

    return conn;
}

module.exports = {getConnection};