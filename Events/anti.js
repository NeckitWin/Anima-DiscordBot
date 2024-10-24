const {Events, EmbedBuilder, PermissionsBitField} = require('discord.js');

const calculateCapsPercentage = (text) => {
    const totalLetters = [...text].filter(char => /\p{L}/u.test(char)).length; // Все символы, являющиеся буквами в Юникоде
    const upperCaseLetters = [...text].filter(char => char === char.toUpperCase() && /\p{L}/u.test(char)).length; // Заглавные буквы

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
            const embed = new EmbedBuilder()
                .setTitle(`Anti-Caps Lock System`)
                .setDescription(`Please don't use caps lock!`)
                .setColor(`#ba0000`);

            if (botHighestRole <= memberHighestRole) return;
            if (!message.channel.permissionsFor(botMember).has(PermissionsBitField.Flags.ModerateMembers)) return;
            if (message.author.bot) return;
            if (!message.length > 3) return;
            if (capsPercentage > 60) {
                await message.reply({content: `${member}`, embeds: [embed]});
                await message.delete();
                await member.timeout(5*60*1000);
            }
        } catch (err) {
            console.error(err);
        }
    }
}