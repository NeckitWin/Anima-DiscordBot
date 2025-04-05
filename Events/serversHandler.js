import {Events, EmbedBuilder} from 'discord.js';
import {Webhooks} from "../Config/Webhooks.js";
import {updateServerCount} from "../Features/commandLog.js";

export default [
    {
        name: Events.GuildCreate,
        async execute(guild) {
            try {
                if (!guild.name) return;
                const getOwner = await guild.members.fetch(guild.ownerId);
                const owner = getOwner.user;
                const memberCount = guild.memberCount;


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

                await updateServerCount();
                await Webhooks.webhookServerHandler.send({embeds: [embed]})
            } catch (e) {
                console.error(e);
            }
        }
    },
    {
        name: Events.GuildDelete,
        async execute(guild) {
            try {
                if (!guild.name) return;
                const memberCount = guild.memberCount;

                const embed = new EmbedBuilder()
                    .setTitle(`Bot deleted from server`)
                    .setThumbnail(guild.iconURL())
                    .setColor(`#ff0044`)
                    .addFields(
                        {name: `Guild Name:`, value: `\`\`\`fix\n${guild.name}\`\`\``, inline: false},
                        {name: `User count`, value: `\`\`\`fix\n${memberCount}\`\`\``, inline: true}
                    );

                await updateServerCount();
                await Webhooks.webhookServerHandler.send({embeds: [embed]})
            } catch (e) {
                console.error(e);
            }
        }
    }
]