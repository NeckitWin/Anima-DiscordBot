const {SlashCommandBuilder, EmbedBuilder, Colors} = require('discord.js');
const lang = require('../../Data/Lang');
const mysql = require('mysql');
const {host, user, password, database} = require('../../Data/database.json');

console.log("command Info/leaders.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaders")
        .setNameLocalizations(
            {ru: 'лидеры', pl: 'liderzy', uk: 'лідери'}
        )
        .setDescription('Shows the top 10 users with the most messages')
        .setDescriptionLocalizations({
            ru: 'Показывает топ 10 пользователей с наибольшим количеством сообщений',
            pl: 'Pokazuje 10 użytkowników z największą ilością wiadomości',
            uk: 'Показує топ 10 користувачів з найбільшою кількістю повідомлень'
        }),
    async execute(interaction) {
        try {
            const connection = mysql.createPool({
                host: host,
                user: user,
                password: password,
                database: database
            });
            const sql = `SELECT * FROM users ORDER BY xp DESC LIMIT 10`;
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    connection.end();
                } else {
                    let message = '';
                    for (let i = 0; i < result.length; i++) {
                        message += `${i+1}. ${result[i].name} - ${result[i].xp} <a:xp:1218641153847459972>\n`;
                    }
                    const embed = new EmbedBuilder()
                        .setTitle("Top users")
                        .setDescription(message)
                        .setColor(Colors.DarkPurple)
                        .setThumbnail(interaction.client.user.avatarURL())

                    interaction.reply({embeds: [embed]});
                    connection.end();
                }
            });

        } catch (error) {
            console.error('Error in leaders.js:', error);
            console.log('Error in leaders.js file');
        }
    }
}