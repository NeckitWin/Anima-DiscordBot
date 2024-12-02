const {Events, EmbedBuilder} = require("discord.js");
const {getLang} = require("../Data/Lang");
const {getTypeChannel} = require("../Data/funcs/getTypeChannel");
const {getServer} = require("../Data/funcs/dbServer");

const checkServer = async (message) => {
    try {
        const guildID = message.guild.id;
        const guildName = message.guild.name;
        const {logs} = await getServer(guildID, guildName);
        if (logs !== 0) {
            return message.guild.channels.cache.get(logs);
        } else return false;
    } catch (err) {
        console.error(err);
    }
}

const sendLog = async (channel, embed) => {
    try {
        await channel.send({embeds: [embed]});
    } catch (err) {
        console.error(err);
    }
}

module.exports = [
    {
        name: Events.MessageCreate,
        async execute(message) {
            if (!message.author.bot) return console.log(`${message.guild}|${message.author.username} - ${message.content}`);
        }
    },
    {
        name: Events.GuildMemberAdd,
        async execute(member) {
            const logChannel = await checkServer(member);
            if (!logChannel) return;

            const lang = await getLang(member);
            const localMember = lang.loggs.member;

            const embed = new EmbedBuilder()
                .setTitle(localMember.join)
                .setDescription(`Имя: \`\`\`${member.user.displayName}\`\`\``)
                .addFields([
                    {name: "ID пользователя", value: `\`\`\`${member.user.id}\`\`\``, inline: true},
                    {name: "Имя пользователя", value: `\`\`\`${member.user.username}\`\`\``, inline: true}
                ])
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()
                .setColor(`#00ff00`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.GuildMemberRemove,
        async execute(member) {
            const logChannel = await checkServer(member);
            if (!logChannel) return;

            const lang = await getLang(member);
            const localMember = lang.loggs.member;

            const embed = new EmbedBuilder()
                .setTitle("Пользователь вышел")
                .setDescription(`Имя: \`\`\`${member.user.displayName}\`\`\``)
                .addFields([
                    {name: "ID пользователя", value: `\`\`\`${member.user.id}\`\`\``, inline: true},
                    {name: "Имя пользователя", value: `\`\`\`${member.user.username}\`\`\``, inline: true}
                ])
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()
                .setColor(`#ff0000`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.MessageDelete,
        async execute(message) {
            const logChannel = await checkServer(message);
            if (!logChannel) return;
            if (message.author.bot) return;

            const lang = await getLang(message);
            const localMessage = lang.loggs.message;

            const embed = new EmbedBuilder()
                .setTitle("Сообщение удалено")
                .setDescription(`Содержимое: \`\`\`${message.content}\`\`\``)
                .addFields([
                    {name: "ID сообщения", value: `\`\`\`${message.id}\`\`\``, inline: false},
                    {name: "Канал", value: `\`\`\`${message.channel.name}\`\`\``, inline: true},
                    {name: "ID канала", value: `\`\`\`${message.channel.id}\`\`\``, inline: true}
                ])
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter({
                    text: `Автор: ${message.author.username}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .setColor(`#ff0000`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.MessageUpdate,
        async execute(oldMessage, newMessage) {
            const logChannel = await checkServer(newMessage);
            if (!logChannel) return;
            if (newMessage.author.bot) return;

            const lang = await getLang(newMessage);
            const localMessage = lang.loggs.message;

            const embed = new EmbedBuilder()
                .setTitle("Сообщение изменено")
                .setDescription(`Старое: \`\`\`${oldMessage.content}\`\`\`\nНовое: \`\`\`${newMessage.content}\`\`\``)
                .setFooter({
                    text: `Автор: ${oldMessage.author.username}`,
                    iconURL: oldMessage.author.displayAvatarURL()
                })
                .setTimestamp()
                .setColor(`#00d9ff`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.ChannelCreate,
        async execute(channel) {
            const logChannel = await checkServer(channel);
            if (!logChannel) return;

            const lang = await getLang(channel);
            const localChannel = lang.loggs.channel;

            const channelType = getTypeChannel(channel.type);
            const embed = new EmbedBuilder()
                .setTitle("Канал создан")
                .setDescription(`Канал: ${channel}`)
                .addFields([
                    {name: "Имя канала", value: `\`\`\`${channel.name}\`\`\``, inline: true},
                    {name: "Тип канала", value: `\`\`\`${localChannel.types[channelType]}\`\`\``, inline: true},
                    {name: "ID канала", value: `\`\`\`${channel.id}\`\`\``, inline: false},
                    {name: "NSFW", value: `\`\`\`${channel.nsfw}\`\`\``, inline: true}
                ])
                .setThumbnail(channel.guild.iconURL())
                .setTimestamp()
                .setColor(`#00ff00`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.ChannelDelete,
        async execute(channel) {
            const logChannel = await checkServer(channel);
            if (!logChannel) return;

            const lang = await getLang(channel);
            const localChannel = lang.loggs.channel;
            const channelType = getTypeChannel(channel.type);

            const embed = new EmbedBuilder()
                .setTitle(localChannel.delete)
                .setDescription(`${localChannel.channel}: ${channel}`)
                .addFields([
                    {name: localChannel.name, value: `\`\`\`${channel.name}\`\`\``, inline: true},
                    {name: localChannel.type, value: `\`\`\`${localChannel.types[channelType]}\`\`\``, inline: true},
                    {name: localChannel.channel_id, value: `\`\`\`${channel.id}\`\`\``, inline: false},
                    {name: `nsfw`, value: `\`\`\`${channel.nsfw}\`\`\``, inline: true}
                ])
                .setThumbnail(channel.guild.iconURL())
                .setTimestamp()
                .setColor(`#ff0000`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.ChannelUpdate,
        async execute(oldChannel, newChannel) {
            const logChannel = await checkServer(newChannel);
            if (!logChannel) return;

            const lang = await getLang(newChannel);
            const localChannel = lang.loggs.channel;
            const channelType = getTypeChannel(newChannel.type);
            if (oldChannel.position !== newChannel.position) return;

            const embed = new EmbedBuilder()
                .setTitle(localChannel.update)
                .setDescription(`${localChannel.channel}: ${newChannel}`)
                .addFields([
                    oldChannel.name !== newChannel.name ? {
                        name: localChannel.old,
                        value: `\`\`\`${oldChannel.name}\`\`\``,
                        inline: true
                    } : undefined,
                    {name: localChannel.new, value: `\`\`\`${newChannel.name}\`\`\``, inline: true},
                    {name: localChannel.type, value: `\`\`\`${localChannel.types[channelType]}\`\`\``, inline: false},
                    {name: localChannel.channel_id, value: `\`\`\`${newChannel.id}\`\`\``, inline: false},
                    {name: `nsfw`, value: `\`\`\`${newChannel.nsfw}\`\`\``, inline: true}
                ].filter(Boolean))
                .setThumbnail(newChannel.guild.iconURL())
                .setTimestamp()
                .setColor(`#00d9ff`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.GuildRoleCreate,
        async execute(role) {
            const logChannel = await checkServer(role);
            if (!logChannel) return;

            const lang = await getLang(role);
            const localRole = lang.loggs.role;

            const embed = new EmbedBuilder()
                .setTitle(localRole.create)
                .setDescription(`${localRole.role}: ${role}`)
                .addFields([
                    {name: localRole.name, value: `\`\`\`${role.name}\`\`\``, inline: true},
                    {name: localRole.role_id, value: `\`\`\`${role.id}\`\`\``, inline: true},
                    {name: localRole.color, value: `\`\`\`${role.hexColor}\`\`\``, inline: true},
                    {name: localRole.hoist, value: `\`\`\`${role.hoist}\`\`\``, inline: true},
                    {name: localRole.position, value: `\`\`\`${role.position}\`\`\``, inline: true},
                    {
                        name: localRole.permissions,
                        value: `\`\`\`${role.permissions.toArray().join(`, `)}\`\`\``,
                        inline: false
                    }
                ])
                .setThumbnail(role.guild.iconURL())
                .setTimestamp()
                .setColor(`#00ff00`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.GuildRoleUpdate,
        async execute(oldRole, newRole) {
            const logChannel = await checkServer(newRole);
            if (!logChannel) return;

            const lang = await getLang(newRole);
            const localRole = lang.loggs.role;

            if (oldRole.position !== newRole.position) return;

            const embed = new EmbedBuilder()
                .setTitle(localRole.update)
                .setDescription(`${localRole.role}: ${newRole}`)
                .addFields([
                    oldRole.name !== newRole.name ? {
                        name: localRole.old,
                        value: `\`\`\`${oldRole.name}\`\`\``,
                        inline: true
                    } : undefined,
                    {name: localRole.new, value: `\`\`\`${newRole.name}\`\`\``, inline: true},
                    {name: localRole.color, value: `\`\`\`fix\n${newRole.hexColor}\`\`\``, inline: true},
                    {name: localRole.position, value: `\`\`\`${newRole.position}\`\`\``, inline: true},
                    {name: localRole.hoist, value: `\`\`\`${newRole.hoist}\`\`\``, inline: true},
                    {
                        name: localRole.permissions,
                        value: `\`\`\`${newRole.permissions.toArray().join(`, `)}\`\`\``,
                        inline: true
                    }
                ].filter(Boolean))
                .setThumbnail(newRole.guild.iconURL())
                .setTimestamp()
                .setColor(`#00d9ff`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.GuildRoleDelete,
        async execute(role) {
            const logChannel = await checkServer(role);
            if (!logChannel) return;

            const lang = await getLang(role);
            const localRole = lang.loggs.role;

            const embed = new EmbedBuilder()
                .setTitle(localRole.delete)
                .setDescription(` `)
                .addFields([
                    {name: localRole.name, value: `\`\`\`${role.name}\`\`\``, inline: true},
                    {name: localRole.role_id, value: `\`\`\`${role.id}\`\`\``, inline: true},
                    {name: localRole.color, value: `\`\`\`${role.hexColor}\`\`\``, inline: true},
                    {name: localRole.hoist, value: `\`\`\`${role.hoist}\`\`\``, inline: true},
                    {name: localRole.position, value: `\`\`\`${role.position}\`\`\``, inline: true},
                    {
                        name: localRole.permissions,
                        value: `\`\`\`${role.permissions.toArray().join(`, `)}\`\`\``,
                        inline: false
                    }
                ])
                .setThumbnail(role.guild.iconURL())
                .setTimestamp()
                .setColor(`#ff0000`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.GuildMemberUpdate,
        async execute(oldMember, newMember) {
            try {
                const logChannel = await checkServer(newMember);
                if (!logChannel) return;
                const newGuildMember = newMember.guild.members.cache.get(newMember.id);
                const userColor = newGuildMember.displayColor;
                const embed = new EmbedBuilder()
                    .setTitle(`Участник ${newMember.user.displayName} обновлён`)
                    .setDescription(`Member: ${newMember}\nMember ID: \`${newMember.id}\`\nUsername: \`${newMember.user.username}\``)
                    .setThumbnail(newGuildMember.displayAvatarURL())
                    .setColor(userColor)
                    .setTimestamp(new Date());
                const oldRoles = oldMember.roles.cache;
                const newRoles = newMember.roles.cache;

                if (oldMember.displayName !== newMember.displayName) {
                    embed.addFields(
                        {name: `Old server name`, value: `\`\`\`${oldMember.displayName}\`\`\``, inline: true},
                        {name: `New server name`, value: `\`\`\`${newMember.displayName}\`\`\``, inline: true}
                    );
                }
                if (oldMember.displayAvatarURL() !== newMember.displayAvatarURL()) {
                    embed.addFields(
                        {name: `Обновление аватара`, value: `[Ссылка на аватар](${newGuildMember.displayAvatarURL()})`, inline: true}
                    );
                }

                if (oldRoles !== newRoles) {
                    if (oldRoles.size > newRoles.size) {
                        const role = oldRoles.filter(role => !newRoles.has(role.id));
                        const rolesName = role.map(role => role).join(`\n`);
                        embed.addFields(
                            {name: `Изменении роли`, value: `Потеряны роль:\n${rolesName}`, inline: true}
                        );
                    } else if (oldRoles.size < newRoles.size) {
                        const role = newRoles.filter(role => !oldRoles.has(role.id));
                        const rolesName = role.map(role => role).join(`\n`);
                        embed.addFields(
                            {name: `Изменении роли`, value: `Добавлены роли:\n${rolesName}`, inline: true}
                        );
                    }
                }

                await sendLog(logChannel, embed);
            } catch (err) {
                console.error(err);
            }
        }
    }
]