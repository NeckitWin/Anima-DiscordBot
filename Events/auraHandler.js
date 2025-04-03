import { EmbedBuilder } from 'discord.js';
import { updateAura } from '../Features/dbUser.js';
import { getLang } from '../Data/Lang/index.js';
import { commandLog } from '../Features/commandLog.js';
import { setCooldown } from '../Features/customCooldown.js';

const PlusAura = [
    'https://c.tenor.com/b8SJCiQHnF8AAAAC/tenor.gif',
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2VlNzAwbWxvcm8xZmg1MmppeDdjNmk5NzQxN3R3ZXVqcmJzN25jayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u2Wgd4OwsA0Ny69v20/giphy.gif',
    'https://media.tenor.com/mawaqOU-OiQAAAAM/smoke-packwatch.gif',
    "https://media.tenor.com/iwQGIHTc7vkAAAAM/dragon-ball-dragon-ball-super.gif",
    "https://c.tenor.com/V-hBwZY0QQ0AAAAd/tenor.gif"
]
const MinusAura = [
    'https://c.tenor.com/0x5op-jCThgAAAAC/tenor.gif',
    'https://c.tenor.com/0Ln8TCeAVPQAAAAC/tenor.gif',
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ24zZmZ6anphaXE2dGRhZnl2d2NpbHI4ZHFjY2RhcWFvdGZzNGk2bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4NM2GkFUSPLiVQP0c9/giphy.gif',
    'https://c.tenor.com/F-D5EhlQXdMAAAAC/tenor.gif'
]

export default {
    cooldown: 60,
    name: 'messageCreate',
    async execute(message) {
        try {
            if (!(message.content === '-aura' || message.content === '+aura')) return;
            if(!commandLog("auraButtons", message, 1)) return;

            const lang = await getLang(message);
            const local = lang.aura;

            const replyUser = message.mentions.repliedUser;
            if (replyUser === null || replyUser === undefined) return message.reply({
                content: lang.error.mustreply,
                ephemeral: true
            });
            if (replyUser.id === message.author.id) return message.reply(local.cantyourself);
            if (replyUser.bot) return message.reply(local.cantbot);

            if (!await setCooldown("aura", message, 60)) return;

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
        } catch (err) {
            console.error(err);
        }
    }
}