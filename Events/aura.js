const {Message, EmbedBuilder} = require('discord.js');
const {getConnection} = require('../Data/db');
const conn = getConnection();

const PlusAura = [
    'https://media1.tenor.com/m/b8SJCiQHnF8AAAAC/backind-back.gif',
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2VlNzAwbWxvcm8xZmg1MmppeDdjNmk5NzQxN3R3ZXVqcmJzN25jayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u2Wgd4OwsA0Ny69v20/giphy.gif',
    'https://media.tenor.com/mawaqOU-OiQAAAAM/smoke-packwatch.gif'
]
const MinusAura = [
        'https://media1.tenor.com/m/0x5op-jCThgAAAAC/aura-diagnosis.gif',
        'https://media1.tenor.com/m/0Ln8TCeAVPQAAAAC/backind-backind-aura.gif',
        'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ24zZmZ6anphaXE2dGRhZnl2d2NpbHI4ZHFjY2RhcWFvdGZzNGk2bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4NM2GkFUSPLiVQP0c9/giphy.gif',
        'https://media1.tenor.com/m/F-D5EhlQXdMAAAAC/nalog.gif'
    ]

module.exports = {
    name: 'messageCreate',
    async execute(message = new Message()) {
        try {
            if (!(message.content === '-aura' || message.content === '+aura')) return;
            const replyUser = message.mentions.repliedUser;
            if (replyUser === null) return message.reply('You have to reply to someone\'s message!');
            if (replyUser.id === message.author.id) return message.reply('You can\'t give aura to yourself!');
            if (replyUser.bot) return message.reply('You can\'t give aura to bot!');
            const random = parseInt(Math.random() * (10000 - 100) + 100);



            const embed = new EmbedBuilder()
                .setTitle(replyUser.displayName + " got an aura")
            let sign;
            if (message.content === '-aura') {
                sign = "-";

                embed.setDescription(`-${random} aura`)
                    .setColor("#ff0000")
                    .setImage(MinusAura[Math.floor(Math.random() * MinusAura.length)]);
            } else if (message.content === '+aura') {
                sign = "+";

                embed.setDescription(`+${random} aura`)
                    .setColor("#00ff00")
                    .setImage(PlusAura[Math.floor(Math.random() * PlusAura.length)]);
            }

            sql = `UPDATE wallet SET aura=aura${sign}? WHERE userID=? AND serverID=?`
            conn.query(sql, [random, message.author.id, message.guild.id], (err, res) => {
                if (err) console.error(err);
            })




            message.channel.send({embeds: [embed]});
        } catch (e) {
            console.error(e);
        }
    }
}