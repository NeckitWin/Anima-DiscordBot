// Команда help - показывает список команд

const { SlashCommandBuilder } = require("discord.js");

console.log("command Info/help.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Показывает список команд'),
    async execute(interaction) {
        const embed = {
            color: 0x0099ff,
            title: `Список команд`,
            thumbnail: {
                url: interaction.client.user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: 'Информация',
                    value: 'user, bot',
                    inline: true,
                },
                {
                    name: 'Утилиты',
                    value: 'ping, test',
                    inline: true,
                },
            ],
        };
        interaction.reply({ embeds: [embed] });
    }
}