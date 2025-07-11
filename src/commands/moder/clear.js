import { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, EmbedBuilder } from 'discord.js';
import { getLang } from "../../utils/lang.ts";
import errorLog from "../../utils/errorLog.ts";
export default {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setNameLocalizations({ ru: 'очистить', pl: 'wyczyść', uk: 'очистити' })
        .setDescription('Clears chat for specified amount of messages')
        .setDescriptionLocalizations({
        ru: 'Очищает чат на указанное количество сообщений',
        pl: 'Czyści czat na określoną liczbę wiadomości',
        uk: 'Очищає чат на вказану кількість повідомлень'
    })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => option.setName('amount')
        .setNameLocalizations({ ru: 'количество', pl: 'ilość', uk: 'кількість' })
        .setDescription('amount of messages to clear')
        .setDescriptionLocalizations({
        ru: 'Количество сообщений для удаления',
        pl: 'Ilość wiadomości do usunięcia',
        uk: 'Кількість повідомлень для видалення'
    })
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            if (!interaction.guild)
                return await interaction.reply({ content: lang.error.notguild, ephemeral: true });
            const local = lang.clear;
            const amount = interaction.options.getInteger('amount');
            const embedLoading = new EmbedBuilder()
                .setTitle(`<a:loading:1295096250609172611> ${lang.loading}`)
                .setColor(`#00ffd0`);
            const embedPerm = new EmbedBuilder()
                .setTitle(lang.error.botdontpermmanagemessages)
                .setColor(`#d80000`);
            const embedSuccess = new EmbedBuilder()
                .setTitle(`${local.successFirst} ${amount} ${local.successSecond}`)
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL() })
                .setColor(`#00ac00`);
            await interaction.reply({ embeds: [embedLoading], ephemeral: true });
            if (interaction.guild && !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ManageMessages))
                return await interaction.editReply({ embeds: [embedPerm] });
            if (amount < 1 || amount > 100)
                return await interaction.editReply({ embeds: [embedPerm.setTitle(local.amount)] });
            await interaction.channel.bulkDelete(amount, true);
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embedSuccess], ephemeral: false });
        }
        catch (err) {
            await errorLog(err);
        }
    }
};
