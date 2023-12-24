const { Events } = require('discord.js');

console.log("event is ready")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const systemChannel = member.guild.systemChannel;
            console.log("get channel")
            if (systemChannel) {
                systemChannel.send(`Привет, ${member}! Добро пожаловать на сервер!`);
            }else {
                console.log("Не найдено системного канала");
            }
        } catch (error) {
            console.error(error);
        }
    },
};
