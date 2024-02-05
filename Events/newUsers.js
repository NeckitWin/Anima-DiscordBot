// Message for new users in system channel
const { Events, MessageEmbed, Permissions } = require('discord.js');
const { greetings } = require('../Data/greetings.json');

console.log("Events/newUsers loaded✅")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

        try {
            const systemChannel = member.guild.systemChannel;

            if (systemChannel){
                if (systemChannel.permissionsFor(member.client.user).has("SendMessages")) {
                    const embed = {
                        color: 65407,
                        title: 'Добро пожаловать на наш сервер!',
                        description: `Привет, ${member}! ознакомьтесь с правилами! \n И приступайте к общению!`,
                        thumbnail: {
                            url: member.user.displayAvatarURL({dynamic: true}),
                        },
                        image: {
                            url: randomGreeting,
                        },
                        timestamp: new Date(),
                    };

                    systemChannel.send({embeds: [embed], content: `||${member}||`});
                }else{
                    console.log("У меня нет прав на отправку сообщений в системный канал");
                }
            } else {
                console.log("Не найдено системного канала или нет прав на отправку сообщений");
            }
        } catch (error) {
            console.error(error);
        }
    },
};
