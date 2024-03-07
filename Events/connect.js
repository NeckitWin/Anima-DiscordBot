const { Events, Message } = require('discord.js');
const mysql = require('mysql');
const {host, user, password, database} = require('../Data/databd.json')

console.log('Events/connect loaded✅');

module.exports = {
    name: Events.MessageCreate,
    async execute(client) {
        try {
            const connection = mysql.createConnection({
                host: host,
                user: user,
                password: password,
                database: database
            });
            connection.connect((err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Connected to the database!");
            });

            const sql = `INSERT INTO users (id, username) VALUES (?, ?)`;
            const values = [client.author.id, client.author.username];

            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Data inserted successfully!");
                }
            });

            connection.end;
        } catch (error) {
            console.error('Error event connect:', error);
            console.log('Error in connect.js file');
        }
    }
}