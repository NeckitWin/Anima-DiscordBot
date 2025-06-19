import {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ChatInputCommandInteraction
} from 'discord.js';
import {getRelation} from "../../repo/relationRepository.ts";
import {getLang} from "../../utils/lang.ts";
import errorLog from "../../utils/errorLog.ts";

export default {
    data: new SlashCommandBuilder()
        .setName('marry')
        .setNameLocalizations({ru: `брак`, pl: `małżeństwo`, uk: `шлюб`})
        .setDescription(`Start a relationship with someone`)
        .setDescriptionLocalizations({
            ru: `Начните отношения с кем-то`,
            pl: `Zacznij związek z kimś`,
            uk: `Почніть відносини з кимось`
        })
        .addUserOption(option =>
            option.setName(`user`)
                .setNameLocalizations({ru: `пользователь`, pl: `użytkownik`, uk: `користувач`})
                .setDescription(`Choose the user to start a relationship`)
                .setDescriptionLocalizations({
                    ru: `Выберите пользователя для начала отношений`,
                    pl: `Wybierz użytkownika, z którym chcesz zacząć związek`,
                    uk: `Виберіть користувача для початку відносин`
                })
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const lang = await getLang(interaction);
            if (!interaction.guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});
            const local = lang.marry;
            const mentionUser = interaction.options.getUser(`user`);
            const checkRelation = await getRelation(interaction.guild.id, interaction.user.id);
            const embedError = new EmbedBuilder()
                .setColor(`#c30000`);

            if (mentionUser) {
                const mentionUserBot = mentionUser.bot;
                const isRelation = checkRelation.length > 0;
                const SelfMention = mentionUser.id === interaction.user.id;
                const MentionUserRelation = await getRelation(interaction.guild.id, mentionUser.id);
                const isMentionUserRelation = MentionUserRelation.length > 0;

                if (mentionUserBot || SelfMention || isRelation || isMentionUserRelation) {
                    let relationError;
                    if (mentionUserBot) relationError = lang.error.dontbot;
                    if (isMentionUserRelation) relationError = local.wasMarry;
                    if (SelfMention) relationError = lang.error.dontyourself
                    if (isRelation) relationError = local.youWasMarry;
                    embedError.setTitle(relationError);
                    return interaction.reply({embeds: [embedError], ephemeral: true});
                }

                const embed = new EmbedBuilder()
                    .setAuthor({
                        iconURL: `https://cdn-icons-png.flaticon.com/512/5065/5065586.png`,
                        name: local.wedding
                    })
                    .setDescription(`${interaction.user} ${local.proposal}`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setFooter({iconURL: interaction.guild.iconURL()!, text: interaction.guild.name})
                    .setTimestamp(new Date());

                const ButtonAccept = new ButtonBuilder()
                    .setLabel(local.proposalYes)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`💍`)
                    .setCustomId(`marryAccept`);

                const ButtonDecline = new ButtonBuilder()
                    .setLabel(local.proposalNo)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`❌`)
                    .setCustomId(`marryDecline`);

                const ActionRow = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(ButtonAccept, ButtonDecline);

                interaction.reply({content: `${mentionUser}`, embeds: [embed], components: [ActionRow]});
            } else {
                if (!checkRelation) {
                    embedError.setTitle(local.dontHave);
                    return interaction.reply({embeds: [embedError], ephemeral: true});
                }
                const relation = checkRelation[0];
                const getRelationUser = interaction.user.id === relation.userID1 ? relation.userID2 : relation.userID1;
                const relationUser = await interaction.guild.members.fetch(getRelationUser).catch(() => lang.error.usernotfound);

                const relationDate = Math.floor(new Date(relation.date).getTime() / 1000);
                const embed = new EmbedBuilder()
                    .setAuthor({iconURL: `https://cdn-icons-png.flaticon.com/512/852/852536.png`, name: local.marry})
                    .setDescription(`<:hearts:1300282044047429682> ${local.yourLove}: **${relationUser.user ? relationUser.user.displayName : relationUser}** (${relationUser})\n` +
                        `<:date:1297196424882294796> ${local.date}: **<t:${relationDate}:R>**`)
                    .setColor(`#ffc5d9`)
                    .setFooter({iconURL: interaction.guild.iconURL()!, text: interaction.guild.name})
                    .setTimestamp(new Date());

                if (relationUser.user) {
                    embed.setThumbnail(interaction.user.displayAvatarURL())
                }

                const buttonDivorce = new ButtonBuilder()
                    .setLabel(local.divorce)
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`marryDivorce`)
                    .setEmoji(`💔`);

                const ActionRow = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([buttonDivorce]);

                await interaction.reply({embeds: [embed], components: [ActionRow]});
            }
        } catch (err) {
            await errorLog(err);
        }
    }
}