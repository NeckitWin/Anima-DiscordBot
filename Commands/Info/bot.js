const { SlashCommandBuilder } = require("discord.js");

console.log("bot.js загружен✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Показывает информацию о боте'),
    async execute(interaction) {
        const embed = {
            color: 0x0099ff,
            title: `Информация о боте ${interaction.client.user.username}`,
            thumbnail: {
                url: interaction.client.user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: 'Меня зовут Элэйн',
                    value: '',
                    inline: true,
                },
                {
                    name: 'Моё ID',
                    value: interaction.client.user.id,
                    inline: false,
                },
                {
                    name: 'Когда я была создана',
                    value: interaction.client.user.createdAt,
                    inline: true,
                }
            ],
        };
        interaction.reply({ embeds: [embed] });
    }
};