import {
    SlashCommandBuilder,
    TextInputStyle,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    PermissionFlagsBits
} from 'discord.js';
import {getLang} from "../../Data/Lang/index.js";

export default {
    data: new SlashCommandBuilder()
        .setName('post')
        .setNameLocalizations({ru: `пост`, pl: `post`, uk: `пост`})
        .setDescription(`Post a embed message to a channel`)
        .setDescriptionLocalizations({
            ru: `Отправить сообщение в канал`,
            pl: `Wyślij wiadomość na kanał`,
            uk: `Відправити повідомлення в канал`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option =>
            option.setName(`author`)
                .setNameLocalizations({ru: `автор`, pl: `autor`, uk: `автор`})
                .setDescription(`Choose the author of the post`)
                .setDescriptionLocalizations({
                    ru: `Выберите автора поста`,
                    pl: `Wybierz autora posta`,
                    uk: `Виберіть автора поста`
                })
                .setRequired(false)),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const local = lang.post;
            if (interaction.guild && !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return await interaction.reply({
                content: lang.error.commandformanageserver,
                ephemeral: true
            });
            const botMember = await interaction.guild.members.fetchMe();
            const channel = interaction.guild.channels.cache.get(interaction.channelId);

            if (!channel.permissionsFor(botMember).has(PermissionFlagsBits.ViewChannel)) {
                return await interaction.reply({
                    content: lang.error.botdontpermviewchannel,
                    ephemeral: true
                });
            }

            if (!channel.permissionsFor(botMember).has(PermissionFlagsBits.SendMessages)) {
                return await interaction.reply({
                    content: lang.error.botdontpermsendmessage,
                    ephemeral: true
                });
            }

            const target = interaction.options.getUser(`author`);
            const modal = new ModalBuilder()
                .setCustomId(`postModal`)
                .setTitle(local.title);

            const postText = new TextInputBuilder()
                .setCustomId('postText')
                .setLabel(local.text)
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const postDescription = new TextInputBuilder()
                .setCustomId('postDescription')
                .setLabel(local.content)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false);

            const postColor = new TextInputBuilder()
                .setCustomId('postColor')
                .setLabel(`${local.color} (hex)`)
                .setPlaceholder(`${local.example}: #000000`)
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const postImage = new TextInputBuilder()
                .setCustomId('postImage')
                .setLabel(local.image)
                .setPlaceholder(`https://${local.example}.com/image.png`)
                .setStyle(TextInputStyle.Short)
                .setRequired(false);


            const postAuthor = new TextInputBuilder()
                .setCustomId('postAuthor')
                .setLabel(local.author)
                .setValue(target ? target.id : ` `)
                .setPlaceholder("1234567890")
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const firstActionRow = new ActionRowBuilder().addComponents(postText);
            const secondActionRow = new ActionRowBuilder().addComponents(postDescription);
            const thirdActionRow = new ActionRowBuilder().addComponents(postColor);
            const fourthActionRow = new ActionRowBuilder().addComponents(postImage);
            const fifthActionRow = new ActionRowBuilder().addComponents(postAuthor);

            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

            await interaction.showModal(modal);
            await interaction.followUp({content: local.fill, ephemeral: true});

        } catch (err) {
            console.error(err);
        }
    }
}