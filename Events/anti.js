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
            if (content.length < 4) return;
            const {antiCaps} = await getServer(message.guild.id, message.guild.name);
            if (!antiCaps) return;
            if (!message.guild) return;
            const capsPercentage = calculateCapsPercentage(content);
            if (capsPercentage < 60) return;
            const member = message.guild.members.cache.get(message.author.id);
            const botMember = message.guild.members.me;
            const botHighestRole = botMember.roles.highest.position || false;
            const memberHighestRole = member.roles.highest.position || false;
            const lang = await getLang(message);
            const local = lang.anti;

            if (botHighestRole <= memberHighestRole) return;
            if (!message.channel.permissionsFor(botMember).has(PermissionsBitField.Flags.ModerateMembers)) return;
            if (message.author.bot) return;
            const embed = new EmbedBuilder()
                .setTitle(local.capslock)
                .setDescription(local.capslockresponse)
                .setColor(`#ba0000`);

            await member.timeout(5 * 60 * 1000);
            await message.reply({content: `${member}`, embeds: [embed]});
            await message.delete();

        } catch (err) {
            console.error(err);
        }
    }
}