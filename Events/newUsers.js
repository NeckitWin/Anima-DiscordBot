const { Events, MessageEmbed } = require('discord.js');

console.log("Events/newUsers loaded✅")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const systemChannel = member.guild.systemChannel;
            console.log("get channel")
            if (systemChannel) {
                const embed = {
                    color: 65407,
                    title: 'Добро пожаловать на наш сервер!',
                    description: `${member}, тут вам рады!`,
                    thumbnail: {
                        url: member.user.displayAvatarURL({ dynamic: true }),
                    },
                    image: {
                        url: 'https://i.pinimg.com/originals/c2/e2/1a/c2e21a9d8e17c1d335166dbcbe0bd1bf.gif'
                    },
                    timestamp: new Date(),
                };

                systemChannel.send({ embeds: [embed] });
            } else {
                console.log("Не найдено системного канала");
            }
        } catch (error) {
            console.error(error);
        }
    },
};