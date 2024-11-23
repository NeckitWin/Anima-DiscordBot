const {Events, EmbedBuilder} = require(`discord.js`);
const {getGreet} = require("../Data/funcs/dbGreet");

const greetGif = [
    "https://media1.tenor.com/m/Gp2MsdoLIv4AAAAC/waving-gif.gif",
    "https://media1.tenor.com/m/9aXyxmnYW7oAAAAC/my-dress-up-darling-sono-bisque-doll-wa-koi-wo-suru.gif",
    "https://media1.tenor.com/m/2hBSkJhJarMAAAAC/hi.gif",
    "https://media1.tenor.com/m/zp4x__IgSpYAAAAC/nagomi-yui-pam-pam.gif",
    "https://media1.tenor.com/m/MmTMEtRSIOUAAAAC/nijima-ibuki-d4dj-first-mix.gif"
]

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
            const randomGif = parseInt(Math.random() * greetGif.length);
            const gifGreeting = greetGif[randomGif];

            const embed = new EmbedBuilder()
                .setTitle(greetData.title)
                .setDescription(greetData.content)
                .setColor(`#ffffff`)
                .setThumbnail(member.user.avatarURL())
                .setImage(greetData.picture !== "" ? greetData.picture : gifGreeting)
            await greetingChannel.send({content: `${member}`, embeds: [embed]})
        } catch (err) {
            console.error(err);
        }
    }
}