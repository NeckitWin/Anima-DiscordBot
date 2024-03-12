const {Events} = require('discord.js');
const mysql = require('mysql');
const {host, user, password, database} = require('../Data/database.json');

console.log('Events/connect loaded✅');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        try {
            const connection = mysql.createConnection({
                host: host,
                user: user,
                password: password,
                database: database
            });
            connection.connect(function (err){
                if (err) {
                    console.log('Error connecting to database❌');
                    console.log(err);
                    stop();
                } else {
                    console.log('Connected to database✅');
                    connection.end();
                }
            })
        } catch (error) {
            console.error('Error event connect:', error);
            console.log('Error in connect.js file');
        }
    }
}