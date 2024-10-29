const {Events, EmbedBuilder} = require(`discord.js`);
const {setRelation} = require("../Data/funcs/dbUser");

module.exports = [
    {
        name: Events.InteractionCreate,
        async execute(interaction) {
            if (!interaction.isButton()) return;
            if (!['declineRelation', 'acceptRelation', 'cancelRelation'].includes(interaction.customId)) return;
            try {
                const guildID = interaction.guild.id;
                const authorInteraction = interaction.message.interaction.user;
                const user = interaction.user;
                const mentionUser = interaction.message.mentions.users.first();
                const embedError = new EmbedBuilder()
                    .setColor(`#c30000`);

                if (authorInteraction.id === user.id) return interaction.reply({
                    content: `Вы не можете начать отношения с собой`,
                    ephemeral: true
                });
                if (mentionUser.id !== user.id) return interaction.reply({
                    content: `Это предложение было сделано не вам`,
                    ephemeral: true
                });
                if (interaction.customId === `acceptRelation`) {

                    const tryRelation = await setRelation(guildID, authorInteraction.id, mentionUser.id);
                    if (tryRelation) {
                        await interaction.reply({content: `Вы успешно начали отношения`});
                    } else {
                        embedError.setTitle(`Вы уже в отношениях`);
                        await interaction.reply({embeds: [embedError]});
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
]