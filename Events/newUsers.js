const { Events, MessageEmbed } = require('discord.js');
const { greetings } = require('../Data/greetings.json');

console.log("Events/newUsers loaded✅")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        randomGreeting = greetings[Math.floor(Math.random() * (greetings.length-1))];

        try {
            const systemChannel = member.guild.systemChannel;
            console.log("get channel")
            if (systemChannel) {
                const embed = {
                    color: 65407,
                    title: 'Добро пожаловать на наш сервер!',
                    description: `Привет, ${member}! ознакомьтесь с правилами! \n И приступайте к общению!`,
                    thumbnail: {
                        url: member.user.displayAvatarURL({ dynamic: true }),
                    },
                    image: {
                        url: randomGreeting,
                    },
                    timestamp: new Date(),
                };

                systemChannel.send({  embeds: [embed] , content: `||${member}||`});
            } else {
                console.log("Не найдено системного канала");
            }
        } catch (error) {
            console.error(error);
        }
    },
};