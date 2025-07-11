import { Events, EmbedBuilder } from 'discord.js';
import { getGreet } from '../repo/greetRepository.ts';
import { commandLog } from '../utils/commandLog.ts';
import errorLog from "../utils/errorLog.ts";

export default {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            if (member.user.bot) return;
            const serverId = member.guild.id;
            const getGreetData = await getGreet(serverId);
            if (!getGreetData.length > 0) return;
            const greetData = getGreetData[0];
            const greetingChannel = member.guild.channels.cache.get(String(greetData.channelId));
            if (!await commandLog("greetHandle", member, 1)) return;

            let messageContent = greetData.title;
            let embedContent = greetData.content;

            if (messageContent.includes(`{user}`)) {
                messageContent = messageContent.replace(`{user}`, member);
            }

            if (embedContent.includes(`{user}`)) {
                embedContent = embedContent.replace(`{user}`, member);
            }

            const embed = new EmbedBuilder()
                .setDescription(embedContent)
                .setThumbnail(member.user.avatarURL());
            if (greetData.picture) embed.setImage(greetData.picture)

            await greetingChannel.send({content: messageContent, embeds: [embed]})
        } catch (err) {
            await errorLog(err);
        }
    }
}