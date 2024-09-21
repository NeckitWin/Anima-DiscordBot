const {Events} = require('discord.js');
const {getConnection} = require('../Data/db');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return; // not bot

        const con = getConnection();
        const sqlSelect = `SELECT userID FROM users`;
        const sqlInsert = `INSERT INTO users (users.userID, users.username,users.aura)
        VALUES (${message.author.id}, "${message.author.username}", 0)`;
        // test
        con.query(sqlInsert,(err, result) => {
            if (err) console.log(err);
        })
    }
}