const mysql = require("mysql");
const config = require("./config.json");

const getConnection = () => {
    const con = mysql.createConnection({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: "anima",
    });

    con.connect(err => {
        if (err) console.error(err);
    })

    return con;
}

module.exports = {getConnection};