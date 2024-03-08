const {Events, Message} = require('discord.js');
const mysql = require('mysql');
const {host, user, password, database} = require('../Data/databd.json');

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
            connection.connect();

            // try {
            //     connection.query(checkUser, userid, (err, result) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             if (result[0].count !== 0) return;
            //             if (result[0].count === 0) {
            //                 connection.query(sql, values, (err, result) => {
            //                     if (err) {
            //                         console.log(err);
            //                     } else {
            //                         console.log(`User ${username} added to database`);
            //                     }
            //                 });
            //             }
            //         }
            //     });
            // }catch (err){
            //     console.log("error in file addUserToDB: "+err);
            // }
        } catch (error) {
            console.error('Error event connect:', error);
            console.log('Error in connect.js file');
        }
    }
}