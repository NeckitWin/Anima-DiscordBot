const {Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Colors} = require('discord.js');
const lang = require("../Data/Lang");
console.log("Events/modalTP.js loaded✅");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isModalSubmit() && interaction.customId === 'modalTP') {

            let preferredLang = interaction.guild.preferredLocale;
            if (!lang.hasOwnProperty(preferredLang)) {
                preferredLang = 'en';
            }
            let local = lang[preferredLang].technicalProblems;


            const topic = interaction.fields.getTextInputValue('topicTP');
            const description = interaction.fields.getTextInputValue('descriptionTP');
            const OwnerServerID = '984079879802876035';
            const ChannelTPID = '1206389800299667527';
            const technicalGuild = await interaction.client.guilds.fetch(OwnerServerID);
            const technicalChannel = await technicalGuild.channels.fetch(ChannelTPID);

            const embed = new EmbedBuilder()
                .setColor(Colors.DarkPurple)
                .setTitle(`Topic: ${topic}`)
                .setDescription("Problem:\n" + "```\n" + description + "```")
                .setAuthor({
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL({dynamic: true}),
                })
                .setTimestamp(new Date())
                .setFooter({
                    text: `ID: ${interaction.user.id}`
                })

            await technicalChannel.send({embeds: [embed]});

            await interaction.reply({
                content: local.request,
                ephemeral: true
            });
        }
    }
}