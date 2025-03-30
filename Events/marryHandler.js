const {Events, ButtonBuilder, ActionRowBuilder, EmbedBuilder} = require(`discord.js`);
const {removeRelation, setRelation, getRelation} = require("../Features/dbUser");
const {getLang} = require("../Data/Lang");
const {commandLog} = require("../Features/commandLog");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (!interaction.isButton()) return;
            const {customId, guild, user, message} = interaction;
            const marryActions = ['marryAccept', 'marryDecline', 'marryDivorce', 'marryDivorceAccept', 'marryDivorceDecline'];
            const DivorceActions = ['marryDivorce', 'marryDivorceAccept', 'marryDivorceDecline'];
            if (!marryActions.includes(customId)) return;
            if (!commandLog("marryHandle", interaction, 1)) return;
            const authorInteraction = message.interaction.user;
            const mentionUser = message.mentions?.users?.first() || false;
            const getAuthorMarried = await getRelation(guild?.id, authorInteraction.id);
            const isAuthorMarried = getAuthorMarried.length > 0;
            const embedError = new EmbedBuilder()
                .setColor(`#c30000`);

            const lang = await getLang(interaction)
            const local = lang.marry;
            const embedDivorce = new EmbedBuilder()
                .setTitle(local.divorceMarried)
                .setThumbnail(authorInteraction.displayAvatarURL({dynamic: true}))
                .setFooter({iconURL: interaction.guild.iconURL({dynamic: true}), text: interaction.guild.name})
                .setTimestamp(new Date());

            if (DivorceActions.includes(customId)) {
                const partner = getAuthorMarried[0].userID1 === user.id ? getAuthorMarried[0].userID2 : getAuthorMarried[0].userID1;
                const partnerMember = `<@${partner}>`;
                if (user.id !== authorInteraction.id) {
                    embedError.setTitle(lang.error.notyourcommand);
                    return interaction.reply({embeds: [embedError], ephemeral: true});
                }
                if (customId === `marryDivorce`) {
                    embedDivorce.setDescription(`${local.wantDivorce} ${partnerMember}?`)
                        .setThumbnail(authorInteraction.displayAvatarURL());

                    const buttonDivorceAccept = new ButtonBuilder()
                        .setCustomId(`marryDivorceAccept`)
                        .setLabel(lang.yes)
                        .setStyle(`Secondary`);

                    const buttonDivorceDecline = new ButtonBuilder()
                        .setCustomId(`marryDivorceDecline`)
                        .setLabel(lang.no)
                        .setStyle(`Secondary`);

                    const row = new ActionRowBuilder()
                    .addComponents(buttonDivorceAccept, buttonDivorceDecline);

                    await interaction.update({embeds: [embedDivorce], components: [row]});
                } else if (customId === `marryDivorceAccept`) {
                    const relationDate = Math.floor(new Date(getAuthorMarried[0].date).getTime() / 1000);
                    await removeRelation(guild.id, user.id);
                    embedDivorce.setDescription(`${local.divorced1} ${authorInteraction} ${local.divorced2} ${partnerMember} ${local.divorced3}: <t:${relationDate}:R>`);

                    await interaction.update({embeds: [embedDivorce], components: []});
                } else if (customId === `marryDivorceDecline`) {
                    embedDivorce
                        .setColor(`#b3ff87`)
                        .setDescription(local.saveMarried);

                    await interaction.update({embeds: [embedDivorce], components: []});
                }
            } else if (customId === `marryAccept` || customId === `marryDecline`) {
                const getRelationMentionUser = await getRelation(guild.id, mentionUser.id);
                const isMentionUserRelation = getRelationMentionUser.length > 0;

                const marryEmbed = new EmbedBuilder()
                    .setAuthor({iconURL: `https://cdn-icons-png.flaticon.com/512/5065/5065586.png`, name: local.wedding})
                    .setThumbnail(authorInteraction.displayAvatarURL({dynamic: true}))
                    .setFooter({iconURL: interaction.guild.iconURL({dynamic: true}), text: interaction.guild.name})
                    .setTimestamp(new Date());

                let error;


                if (customId === `marryAccept`) {
                    if (mentionUser.id !== user.id) {
                        error = lang.error.notforyou;
                        embedError.setTitle(error);
                        return interaction.reply({embeds: [embedError], ephemeral: true});
                    }
                    if (isAuthorMarried || isMentionUserRelation) {
                        error = local.wasMarry;
                        embedError.setTitle(error);
                        return interaction.reply({embeds: [embedError], ephemeral: true});
                    }
                    await setRelation(guild.id, authorInteraction.id, mentionUser.id);
                    marryEmbed
                        .setAuthor({iconURL: `https://cdn-icons-png.flaticon.com/512/5065/5065586.png`, name: local.wedding})
                        .setDescription(`${local.congratulations} <:hearts:1300282044047429682>`)
                        .setImage(`https://c.tenor.com/-YBoNtfhc0UAAAAd/tenor.gif`)
                        .setColor(`#ffc5d9`);

                    await message.channel.send({content: `${authorInteraction} ${mentionUser}` ,embeds: [marryEmbed], components: []});
                    await message.delete();
                } else if (customId === `marryDecline`) {
                    if (!(mentionUser.id === user.id || user.id === authorInteraction.id)   ) {
                        error = lang.error.notforyou;
                        embedError.setTitle(error);
                        return interaction.reply({embeds: [embedError], ephemeral: true});
                    }
                    marryEmbed
                        .setDescription(local.declined);

                    await message.edit({content: ``, embeds: [marryEmbed], components: []});
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}