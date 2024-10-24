const {Events, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const myServerId = `1246052791097622528`;
        const myChannelId = `1289145043873169438`;
        const myServer = guild.client.guilds.cache.get(myServerId);
        const myChannel = myServer.channels.cache.get(myChannelId);
        const getOwner = await guild.members.fetch(guild.ownerId);
        const owner = getOwner.user;
        const memberCount = guild.memberCount;

        try {

            const embed = new EmbedBuilder()
                .setTitle(`Bot added to new server`)
                .setThumbnail(guild.iconURL())
                .setColor(`#00ff9d`)
                .addFields(
                    {name: `Guild Name:`, value: `\`\`\`fix\n${guild.name}\`\`\``, inline: false},
                    {name: `User count`, value: `\`\`\`fix\n${memberCount}\`\`\``, inline: true},
                    {name: `Guild Owner`, value: `\`\`\`fix\n${owner.username}\`\`\``, inline: true},
                    {name: `Owner ID`, value: `\`\`\`fix\n${owner.id}\`\`\``, inline: true}
                );

            await myChannel.send({embeds: [embed]})

            const firstChannel = guild.channels.cache.find(channel =>
                channel.isTextBased() && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages)
            )

            if (!firstChannel) return;

            const buildInstruction = new EmbedBuilder()
                .setTitle(`<a:anime_wow:1295480143053197322>Hey! I'm Anima!`)
                .setColor(`#dab4ff`)
                .setThumbnail(guild.client.user.avatarURL())
                .setDescription(`Thank you for inviting me to your server!<a:anime_celebrate:1295479990737178634>\n` +
                    `You can **change </language:1292081237837611079>**\n` +
                    `Available languages:\n` +
                    `- 🇺🇸 English\n- 🇷🇺 Russian\n- 🇺🇦 Ukrainian\n- 🇵🇱 Polish\n` +
                    `Also you can use **</help:1285287069676994605>** to get more information about my commands! ❤️‍🔥`)

            firstChannel.send({embeds: [buildInstruction]})
        } catch (e) {
            console.error(e);
        }
    }
}