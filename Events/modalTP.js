const {Events, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
// modal submit command for admin / technical problem
console.log("Events/modalTP.js loaded✅");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isModalSubmit() && interaction.customId === 'modalTP') {
            const topic = interaction.fields.getTextInputValue('topicTP');
            const description = interaction.fields.getTextInputValue('descriptionTP');
            const OwnerServerID = '984079879802876035';
            const ChannelTPID = '1206389800299667527';
            const guild = await interaction.client.guilds.fetch(OwnerServerID);
            const channel = await guild.channels.fetch(ChannelTPID);

            const embed = {
                color: 0x0099ff,
                title: `Тема: ${topic}`,
                description: "Описание:\n"+"```\n"+description+"```",
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL({dynamic: true}),
                },
                timestamp: new Date(),
                footer: {
                    text: `ID: ${interaction.user.id}`,
                },
            };

            await channel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Спасибо, что сообщили об ошибке! Ожидайте исправления в скором времени.', ephemeral: true });
        }
    }

}