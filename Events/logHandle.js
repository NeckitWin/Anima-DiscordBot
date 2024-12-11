const {Events, EmbedBuilder} = require("discord.js");
const {getLang} = require("../Data/Lang");
const {getTypeChannel} = require("../Data/funcs/getTypeChannel");
const {ifServerHasLog} = require("../Data/funcs/logCache");

const checkServer = async (message) => {
    try {
        const {id, name} = message.guild;
        const logChannel = await ifServerHasLog(id, name);
        if (!logChannel) return;
        return message.guild.channels.cache.get(logChannel);
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
        name: Events.MessageUpdate,
        async execute(oldMessage, newMessage) {
            const logChannel = await checkServer(newMessage);
            if (!logChannel) return;
            if (newMessage.author.bot) return;
            const lang = await getLang(newMessage);
            const localMessage = lang.logs.message;
            const {channel, id, author, guild} = newMessage;
            const attachments = oldMessage.attachments.map(attachment => attachment.url);

            const embed = new EmbedBuilder()
                .setTitle(localMessage.edit)
                oldMessage.content ? embed.addFields({name: localMessage.old, value: `\`\`\`${oldMessage.content}\`\`\``, inline: true}) : undefined
                newMessage.content && oldMessage.content !== newMessage.content ? embed.addFields({name: localMessage.new, value: `\`\`\`${newMessage.content}\`\`\``, inline: true}) : undefined
                embed.addFields(
                    {name: " ", value: `**${localMessage.author}**: ${author}\` | ${author.username} | ${author.id}\``, inline: false},
                    {name: localMessage.channel, value: `${channel}: \`${channel.name}\``, inline: true},
                    {name: localMessage.go, value: `https://discord.com/channels/${guild.id}/${channel.id}/${id}`, inline: true}
                )
                .setFooter({
                    text: `${localMessage.id}: ${id}`,
                    iconURL: oldMessage.author.displayAvatarURL()
                })
                .setTimestamp()
                .setColor(`#00ffc4`);

            attachments.length > 0 ? embed.addFields({name: `${localMessage.attachments}[${attachments.length}]`, value: `${attachments.join(`\n`)}`, inline: false}) : undefined;

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
            const localMessage = lang.logs.message;

            const {channel, id, author} = message;
            const attachments = message.attachments.map(attachment => attachment.url);

            const embed = new EmbedBuilder()
                .setTitle(localMessage.delete)
                message.content ? embed.setDescription(`\`\`\`${message.content}\`\`\``) : undefined
                embed.addFields(
                    {name: " ", value: `**${localMessage.author}**: ${author}\` | ${author.username} | ${author.id}\``, inline: false},
                    {name: localMessage.channel, value: `${channel}: \`${channel.name}\``, inline: true}
                )
                .setFooter({
                    text: `${localMessage.id}: ${id}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .setColor(`#ff0000`);

            attachments.length > 0 ? embed.addFields({name: `${localMessage.attachments}[${attachments.length}]`, value: `${attachments.join(`\n`)}`, inline: true}) : undefined;

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.GuildMemberAdd,
        async execute(member) {
            const logChannel = await checkServer(member);
            if (!logChannel) return;

            const lang = await getLang(member);
            const localMember = lang.logs.member;

            const embed = new EmbedBuilder()
                .setTitle(localMember.join)
                .setDescription(`\`\`\`${member.user.displayName}\`\`\``)
                .addFields([
                    {name: localMember.user_id, value: `\`\`\`${member.user.id}\`\`\``, inline: true},
                    {name: localMember.username, value: `\`\`\`${member.user.username}\`\`\``, inline: true},
                    {name: localMember.created, value: `\`\`\`${member.user.createdAt}\`\`\``, inline: true}
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
            const localMember = lang.logs.member;

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
        name: Events.ChannelCreate,
        async execute(channel) {
            const logChannel = await checkServer(channel);
            if (!logChannel) return;

            const lang = await getLang(channel);
            const localChannel = lang.logs.channel;

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
            const localChannel = lang.logs.channel;
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
            const localChannel = lang.logs.channel;
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
            const localRole = lang.logs.role;

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
            const localRole = lang.logs.role;

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
            const localRole = lang.logs.role;

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
                        {
                            name: `Обновление аватара`,
                            value: `[Ссылка на аватар](${newGuildMember.displayAvatarURL()})`,
                            inline: true
                        }
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