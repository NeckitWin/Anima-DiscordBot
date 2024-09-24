const {Events} = require('discord.js');
const {getConnection} = require('../Data/funcs/db');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return; // not bot
        const user_id = message.author.id;
        const displayName = message.author.displayName;

        const conn = getConnection();

        const sqlSelect = `SELECT userID FROM users WHERE users.userID = ${user_id}`; // search user
        conn.query(sqlSelect, (err, result) => {
            if (err) console.error(err);

            if (result.length > 0) { // if user was

                const sqlSelectServer = `SELECT * FROM wallet WHERE serverID = ? AND userID = ?`

                conn.query(sqlSelectServer, [message.guild.id, user_id], (err, res) => {
                    if (err) console.error(err);

                    if (res.length > 0) { // if wallet server be
                        const sqlInsertWallet = `UPDATE wallet SET aura=aura+1317 WHERE serverID = ? AND userID = ?`;
                        conn.query(sqlInsertWallet, [message.guild.id, user_id], (err, res) => {
                            if (err) console.error(err);
                        });
                    } else {
                        const sqlInsertWallet = `INSERT INTO wallet (serverID, userID, serverName) VALUES (?, ?, ?)`;
                        conn.query(sqlInsertWallet, [message.guild.id, user_id, displayName], (err) => {
                            if (err) console.error(err);
                        });
                    }
                })

            } else { // if user wasn't
                const sqlInsertUser = `INSERT INTO users (userID, username) VALUES (?, ?)`;
                conn.query(sqlInsertUser, [user_id, message.author.username], (err) => {
                    if (err) {
                        console.error(err);
                    }
                    const sqlInsertWallet = `INSERT INTO wallet (serverID, userID, serverName) VALUES (?, ?, ?)`;
                    conn.query(sqlInsertWallet, [message.guild.id, user_id, displayName], (err) => {
                        if (err) console.error(err);
                    });
                })
            }
        });
    }
};