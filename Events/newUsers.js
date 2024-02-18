// Message for new users in system channel
const {Events, MessageEmbed, Permissions, EmbedBuilder} = require('discord.js');
const {greetings} = require('../Data/greetings.json');

console.log("Events/newUsers loaded✅")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            if (member.guild.systemChannelId === null || member.guild.systemChannelId === undefined) return console.log("System channel is not set!");
            const ChannelSystem = await member.guild.channels.fetch(member.guild.systemChannelId);
            if (!ChannelSystem.permissionsFor(member.client.user).has("SendMessages")) {
                return member.reply("I don't have permissions to write in this channel!");
            }
            if (member.guild.rulesChannelId === null || member.guild.rulesChannelId === undefined) return console.log("Rules channel is not set!");
            let ChannelRulesId = member.guild.rulesChannelId;

            const embed = new EmbedBuilder()
                .setTitle('Добро пожаловать на наш сервер!')
                .setDescription(`Надеюсь, тебе здесь понравится и ты найдешь много интересных людей и тем для общения.`)
                .setColor('DarkRed')
                //avatar user
                .setThumbnail(member.user.displayAvatarURL())
                .setImage(randomGreeting);

            if (ChannelRulesId !== null) {
                embed.addFields({
                    name: " ",
                    value: `Ознакомьтесь с правилами сервера:\n<#${ChannelRulesId}>`,
                    inline: false
                });
            }
            // arcaneworld
            if (member.guild.systemChannelId === '1127566772074192897') {
                embed.setImage("https://i.vgy.me/5oR64I.png?size=2432");
            }

            await ChannelSystem.send({content: `${member}`, embeds: [embed]});
        } catch (error) {
            console.error('Ошибка ивента newUsers:', error);
            console.log('Не удалось обработать запрос.');
        }
    }
}