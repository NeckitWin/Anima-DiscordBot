const { Events, Permissions, ButtonBuilder, ActionRowBuilder, ButtonStyle, TextChannel, VoiceChannel, CategoryChannel } = require('discord.js');
const discord = require('discord.js');
console.log("Events/newServers loaded✅");

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const myServerId = '984079879802876035';
        const myChannelId = '1179439390095843358';
        const myServer = guild.client.guilds.cache.get(myServerId);
        const myChannel = myServer.channels.cache.get(myChannelId);

        let invite = null;
        let owner = await guild.fetchOwner();

        // Проходим по всем каналам сервера
        const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.client.user).has('CreateInstantInvite'));

        if (channel) {
            try {
                invite = await channel.createInvite({ maxUses: 0, maxAge: 0 });
            } catch (error) {
                console.error(`Не удалось создать приглашение для канала ${channel.id}: ${error}`);
            }
        }

        // Создаем эмбед
        const embed = {
            color: 0x0099ff,
            title: `Бота добавили на сервер! ${guild.name}`,
            thumbnail: {
                url: guild.iconURL(),
            },
            image: {
                url: "https://i.pinimg.com/originals/fb/1a/a7/fb1aa76944c156acc494fff37ebdbcfa.gif",
            },
            fields: [
                {
                    name: "👑 Создатель данного сервера:",
                    value: "```"+owner.user.username+"```",
                    inline: false,
                },
                {
                    name: "👤 Количество участников сервера:",
                    value: "```"+guild.memberCount.toString()+"```",
                    inline: false,
                }
            ],
        };

        // Если удалось создать приглашение, добавляем его в эмбед
        if (invite) {
            const ButtonLinkNewServer = new ButtonBuilder()
                .setURL(invite.url)
                .setLabel("Перейти на сервер")
                .setStyle(ButtonStyle.Link);

            const rowNewServers = new ActionRowBuilder()
                .addComponents(ButtonLinkNewServer)

            myChannel.send({ embeds: [embed], components: [rowNewServers] });
        }else{
            myChannel.send({ embeds: [embed] });
        }
    },
};