const {Events} = require('discord.js');
const {getConnection} = require('../Data/db');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return; // not bot
        const user_id = message.author.id;

        const con = getConnection();

        const sqlSelect = `SELECT userID FROM users WHERE users.userID = ${user_id}`; // search user
        con.query(sqlSelect, (err, result) => {
            if (err) console.error(err);
            if (result.length > 0) { // if user was
                const sqlInsert = `UPDATE wallet SET aura=aura+1317 WHERE userID = ${user_id}`;
                con.query(sqlInsert,(err, result) => {
                    if (err) console.error(err);
                })
            } else { // if user wasn't
                const sqlInsertUser = `INSERT INTO users (userID, username) VALUES (?, ?)`;
                const sqlInsertWallet = `INSERT INTO wallet (serverID, userID) VALUES (?, ?)`;

                con.query(sqlInsertUser, [user_id, message.author.username], (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    con.query(sqlInsertWallet, [message.guild.id, user_id], (err) => {
                        if (err) console.error(err);
                    });
                });
            }
        });
    }
};