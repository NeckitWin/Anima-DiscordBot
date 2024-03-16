const {Events, Message} = require('discord.js');
const mysql = require('mysql');
const {host, user, password, database} = require('../Data/database.json');

console.log('Events/addUsersToDB loaded✅');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (message.author.system) return;
        const userid = parseInt(message.author.id);
        const username = message.author.username;
        const displayname = message.author.displayName;
        const checkUser = `SELECT COUNT(*) AS count FROM users WHERE id = ?`;
        const sql = `INSERT INTO users (id, user, name, xp, coin) VALUES (?, ?, ?, ?, ?)`;
        const values = [userid, username, displayname, 0, 0];
        const sqlxp = `UPDATE users SET xp = xp + 1 WHERE id = ?`

        const connection = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: database
        });
        try {
            connection.query(checkUser, userid, (err, result) => {
                if (err) {
                    console.log(err);
                    connection.end();
                } else {
                    const query = result[0].count !== 0 ? sqlxp : sql;
                    connection.query(query, values, (err) => {
                        if (err) {
                            console.log(err);
                        } else if (query === sql) {
                            console.log(`User ${username} added to database`);
                        }
                        connection.end();
                    });
                }
            });
        }catch (err){
            console.log("error in file addUserToDB: "+err);
        }
    }
}