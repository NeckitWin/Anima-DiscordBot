const {Events, EmbedBuilder} = require(`discord.js`);
const {getGreet} = require("../Data/funcs/dbGreet");
const {commandLog} = require("../Data/funcs/commandLog");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            if (member.user.bot) return;
            const serverID = member.guild.id;
            const getGreetData = await getGreet(serverID);
            if (!getGreetData.length > 0) return;
            const greetData = getGreetData[0];
            const greetingChannel = member.guild.channels.cache.get(String(greetData.channelID));
            if (!commandLog("greetHandle", member, 1)) return;

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
            console.error(err);
        }
    }
}