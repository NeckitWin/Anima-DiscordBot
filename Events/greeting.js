const {Events, EmbedBuilder} = require(`discord.js`);
const path = require("node:path");
const fs = require("node:fs");
const greetingsGif = require("../Data/jsons/greeting_gif.json");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const pathFile = path.join(__dirname, "../Data/jsons/greeting.json");
        const data = await fs.promises.readFile(pathFile, 'utf8');
        const jsonData = JSON.parse(data);
        const serverID = member.guild.id;

        const foundServer = jsonData.find(el => el.server === serverID);
        if (!foundServer) return;
        const greetingChannel = member.guild.channels.cache.get(foundServer.channel);

        const randomGif = parseInt(Math.random()*greetingsGif.length);
        const gifGreeting = greetingsGif[randomGif];

        const embed = new EmbedBuilder()
            .setTitle(foundServer.title)
            .setDescription(foundServer.content)
            .setColor(`#ffffff`)
            .setThumbnail(member.user.avatarURL())
            .setImage(foundServer.picture !== "" ? foundServer.picture : gifGreeting)
        await greetingChannel.send({content: `${member}`, embeds:[embed]})
    }
}