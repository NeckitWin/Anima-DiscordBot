const {Events, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js')

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

        // const inviteChannel = guild.channels.cache.find(channel=>
        //     channel.isTextBased() && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite)
        // )
        //
        // let inviteLink;
        // if (inviteChannel) {
        //     try {
        //         inviteLink = await inviteChannel.createInvite({ maxAge: 0, maxUses: 0 });
        //     } catch (error) {
        //         console.error('Error creating invite:', error);
        //     }
        // }
        //
        // const link = inviteLink ? inviteLink.url : false;

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

        // if (link) {
        //     const buttonInvite = new ButtonBuilder()
        //         .setLabel("Join server")
        //         .setStyle(ButtonStyle.Link)
        //         .setURL(link);
        //
        //     const row = new ActionRowBuilder()
        //         .addComponents(buttonInvite);
        //
        //     await myChannel.send({embeds: [embed], components: [row]});}


        await myChannel.send({embeds: [embed]})
    }
}