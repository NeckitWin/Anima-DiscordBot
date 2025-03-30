import { Events, EmbedBuilder } from 'discord.js';
import { getLang } from '../Data/Lang/index.js';
import { ifServerHasLog } from '../Features/logCache.js';
import { formatDate, getTypeChannel } from '../Features/utility.js';

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

export default [
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

            const dataCreated = formatDate(member.user.createdAt);

            const embed = new EmbedBuilder()
                .setTitle(localMember.join)
                .setDescription(`${localMember.member}: ${member}`)
                .addFields(
                    {name: localMember.name, value: `\`\`\`${member.user.displayName}\`\`\``, inline: true},
                    {name: localMember.username, value: `\`\`\`${member.user.username}\`\`\``, inline: true},
                    {name: localMember.created, value: `\`\`\`${dataCreated}\`\`\``, inline: true}
                )
                .setFooter({text: `${localMember.user_id}: ${member.user.id}`, iconURL: member.guild.iconURL()})
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()
                .setColor(`#00ff00`);

            await sendLog(logChannel, embed);
        }
    },
    {
        name: Events.GuildMemberUpdate,
        async execute(oldMember, newMember) {
            try {
                const logChannel = await checkServer(newMember);
                if (!logChannel) return;

                const lang = await getLang(newMember);
                const localMember = lang.logs.member;

                const newGuildMember = newMember.guild.members.cache.get(newMember.id);
                const embed = new EmbedBuilder()
                    .setTitle(`${localMember.member} ${newMember.user.displayName} ${localMember.update}`)
                    .setDescription(`${localMember.member}: ${newMember}\n${localMember.user_id}: \`${newMember.id}\`\n${localMember.username}: \`${newMember.user.username}\``)
                    .setThumbnail(newGuildMember.displayAvatarURL())
                    .setColor(`#00d9ff`)
                    .setTimestamp();
                const oldRoles = oldMember.roles.cache;
                const newRoles = newMember.roles.cache;

                let changes = 0;

                if (oldMember.displayName !== newMember.displayName) {
                    embed.addFields(
                        {name: localMember.old, value: `\`\`\`${oldMember.displayName}\`\`\``, inline: true},
                        {name: localMember.new, value: `\`\`\`${newMember.displayName}\`\`\``, inline: true}
                    );
                    changes++;
                }
                if (oldMember.displayAvatarURL() !== newMember.displayAvatarURL()) {
                    embed.addFields(
                        {
                            name: localMember.avatarUpdate,
                            value: `[${localMember.avatarLink}](${newGuildMember.displayAvatarURL()})`,
                            inline: true
                        }
                    );
                    changes++;
                }

                if (oldRoles !== newRoles) {
                    if (oldRoles.size > newRoles.size) {
                        const role = oldRoles.filter(role => !newRoles.has(role.id));
                        const rolesName = role.map(role => role).join(`\n`);
                        embed.addFields(
                            {name: localMember.rolesChange, value: `${localMember.rolesRemove}:\n${rolesName}`, inline: true}
                        );
                    } else if (oldRoles.size < newRoles.size) {
                        const role = newRoles.filter(role => !oldRoles.has(role.id));
                        const rolesName = role.map(role => role).join(`\n`);
                        embed.addFields(
                            {name: localMember.rolesChange, value: `${localMember.rolesAdd}:\n${rolesName}`, inline: true}
                        );
                    }
                    changes++;
                }

                if (changes === 0) return;
                await sendLog(logChannel, embed);
            } catch (err) {
                console.error(err);
            }
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
                .setTitle(localMember.leave)
                .setDescription(`${localMember.member}: ${member}`)
                .addFields(
                    {name: localMember.name, value: `\`\`\`${member.user.displayName}\`\`\``, inline: true},
                    {name: localMember.username, value: `\`\`\`${member.user.username}\`\`\``, inline: true},
                    {name: localMember.join, value: `\`\`\`${formatDate(member.joinedAt)}\`\`\``, inline: true}
                )
                .setFooter({text: `${localMember.user_id}: ${member.user.id}`, iconURL: member.guild.iconURL()})
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()
                .setColor(`#d80000`);

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
                .setTitle(localChannel.create)
                .addFields(
                    {name: localChannel.channel, value: channel.toString(), inline: true},
                    {name: localChannel.name, value: `\`${channel.name}\``, inline: true},
                    {name: localChannel.type, value: `\`${localChannel.types[channelType]}\``, inline: true}
                )
                .setThumbnail(channel.guild.iconURL())
                .setFooter({text: `${localChannel.channel_id}: ${channel.id}`, iconURL: channel.guild.iconURL()})
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
            const nsfw = channel.nsfw;

            const embed = new EmbedBuilder()
                .setTitle(localChannel.delete)
                .setDescription(` `)
                .addFields(
                    {name: localChannel.channel, value: `\`${channel.name}\``, inline: true},
                    {name: localChannel.type, value: `\`${localChannel.types[channelType]}\``, inline: true},
                    {name: localChannel.channel_id, value: `\`${channel.id}\``, inline: true}
                )
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
                    {name: `NSFW`, value: `\`\`\`${newChannel.nsfw}\`\`\``, inline: true}
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
    }
]