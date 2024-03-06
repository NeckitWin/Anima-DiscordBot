// Message for new users in system channel
const {Events, Permissions, EmbedBuilder} = require('discord.js');
const {greetings} = require('../Data/greetings.json');
const lang = require('../Data/Lang/lang')

console.log("Events/newUsers loaded✅")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            if (member.guild.systemChannelId === null || member.guild.systemChannelId === undefined) return console.log("System channel is not set!");
            const ChannelSystem = await member.guild.channels.fetch(member.guild.systemChannelId);
            if (!ChannelSystem.permissionsFor(member.client.user).has("SendMessages")) {
                return console.log("I don't have permissions to write in this channel!");
            }
            if (member.guild.rulesChannelId === null || member.guild.rulesChannelId === undefined) return console.log("Rules channel is not set!");
            let ChannelRulesId = member.guild.rulesChannelId;

            let preferredLang = message.guild.preferredLocale;
            if (!lang.hasOwnProperty(preferredLang)) {
                preferredLang = 'en';
            }
            let local = lang[preferredLang].newUsers;

            const embed = new EmbedBuilder()
                .setTitle(local.title)
                .setDescription(local.description)
                .setColor('DarkRed')
                .setThumbnail(member.user.displayAvatarURL())
                .setImage(randomGreeting);

            if (ChannelRulesId !== null) {
                embed.addFields({
                    name: " ",
                    value: `${local.value}\n<#${ChannelRulesId}>`,
                    inline: false
                });
            }

            // arcaneworld
            if (member.guild.systemChannelId === '1127566772074192897') {
                embed.setImage("https://i.vgy.me/5oR64I.png?size=2432");
            }

            await ChannelSystem.send({content: `${member}`, embeds: [embed]});
        } catch (error) {
            console.error('Error event newUsers:', error);
            console.log('Failed to process request.');
        }
    }
}