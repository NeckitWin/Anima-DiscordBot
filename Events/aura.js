const {EmbedBuilder} = require('discord.js');
const {getConnection, updateAura} = require('../Data/funcs/dbUser');
const {getCooldown} = require('../Data/funcs/cooldown');
const {getLang} = require("../Data/Lang");

const PlusAura = [
    'https://media1.tenor.com/m/b8SJCiQHnF8AAAAC/backind-back.gif',
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2VlNzAwbWxvcm8xZmg1MmppeDdjNmk5NzQxN3R3ZXVqcmJzN25jayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u2Wgd4OwsA0Ny69v20/giphy.gif',
    'https://media.tenor.com/mawaqOU-OiQAAAAM/smoke-packwatch.gif',
    "https://media.tenor.com/iwQGIHTc7vkAAAAM/dragon-ball-dragon-ball-super.gif"
]
const MinusAura = [
    'https://media1.tenor.com/m/0x5op-jCThgAAAAC/aura-diagnosis.gif',
    'https://media1.tenor.com/m/0Ln8TCeAVPQAAAAC/backind-backind-aura.gif',
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ24zZmZ6anphaXE2dGRhZnl2d2NpbHI4ZHFjY2RhcWFvdGZzNGk2bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4NM2GkFUSPLiVQP0c9/giphy.gif',
    'https://media1.tenor.com/m/F-D5EhlQXdMAAAAC/nalog.gif'
]

module.exports = {
    cooldown: 60,
    name: 'messageCreate',
    async execute(message) {
        if (!(message.content === '-aura' || message.content === '+aura')) return;

        const lang = await getLang(message);
        const local = lang.aura;

        const replyUser = message.mentions.repliedUser;
        if (replyUser === null || replyUser === undefined) return message.reply({
            content: lang.error.mustreply,
            ephemeral: true
        });
        if (replyUser.id === message.author.id) return message.reply(local.cantyourself);
        if (replyUser.bot) return message.reply(local.cantbot);

        if (await getCooldown('aura', message, 600)) return; // cooldown

        const random = parseInt(Math.random() * (10000 - 100) + 100);


        const embed = new EmbedBuilder()
            .setTitle(`${replyUser.displayName} ${local.title}`)
        let sign;
        if (message.content === '-aura') {
            sign = "-";

            embed.setDescription(`-${random} ${local.aura}`)
                .setColor("#ff0000")
                .setImage(MinusAura[Math.floor(Math.random() * MinusAura.length)]);
        } else if (message.content === '+aura') {
            sign = "+";

            embed.setDescription(`+${random} ${local.aura}`)
                .setColor("#00ff00")
                .setImage(PlusAura[Math.floor(Math.random() * PlusAura.length)]);
        }

        await updateAura(replyUser.id, message.guild.id, sign, random, replyUser.displayName, replyUser.username);

        await message.channel.send({embeds: [embed]});
    }
}