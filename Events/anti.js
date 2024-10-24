const {Events, EmbedBuilder, PermissionsBitField} = require('discord.js');
const {getServer} = require("../Data/funcs/dbServer");
const {getLang} = require("../Data/Lang");

const calculateCapsPercentage = (text) => {
    const totalLetters = [...text].filter(char => /\p{L}/u.test(char)).length;
    const upperCaseLetters = [...text].filter(char => char === char.toUpperCase() && /\p{L}/u.test(char)).length;

    return totalLetters > 0 ? (upperCaseLetters / totalLetters) * 100 : 0;
};

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            const content = message.content;
            const capsPercentage = calculateCapsPercentage(content);
            const member = message.guild.members.cache.get(message.author.id);
            const botMember = message.guild.members.me;
            const botHighestRole = botMember.roles.highest.position;
            const memberHighestRole = member.roles.highest.position;
            const lang = await getLang(message);
            const local = lang.anti;

            if (botHighestRole <= memberHighestRole) return;
            if (!message.channel.permissionsFor(botMember).has(PermissionsBitField.Flags.ModerateMembers)) return;
            if (message.author.bot) return;
            if (!message.length > 3) return;
            const {antiCaps} = await getServer(message.guild.id, message.guild.name);
            if (!antiCaps) return;
            if (capsPercentage < 60) return;
            const embed = new EmbedBuilder()
                .setTitle(local.capslock)
                .setDescription(local.capslockresponse)
                .setColor(`#ba0000`);

            await message.reply({content: `${member}`, embeds: [embed]});
            await message.delete();
            await member.timeout(5 * 60 * 1000);

        } catch (err) {
            console.error(err);
        }
    }
}