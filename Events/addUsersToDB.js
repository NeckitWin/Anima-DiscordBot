const {Events, Message} = require('discord.js');
const mysql = require('mysql');
const {host, user, password, database} = require('../Data/databd.json');

console.log('Events/addUsersToDB loaded✅');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const userid = message.author.id;
        const username = message.author.username;
        const checkUser = `SELECT COUNT(*) AS count FROM users WHERE id = ?`;
        const sql = `INSERT INTO users (id, username) VALUES (?, ?)`;
        const values = [userid, username];

        const connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });
        connection.connect();

        try {
            connection.query(checkUser, userid, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result[0].count !== 0) return;
                    if (result[0].count === 0) {
                        connection.query(sql, values, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(`User ${username} added to database`);
                            }
                        });
                    }
                }
            });
        }catch (err){
            console.log("error in file addUserToDB: "+err);
        }
    }
}