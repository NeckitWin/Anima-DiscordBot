import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChatInputCommandInteraction,
    GuildMember
} from 'discord.js';
import {clearLangCache, getLang} from "../../utils/lang.ts";
import {updateServer} from "../../repo/serverRepository.ts";
import errorLog from "../../utils/errorLog.ts";
import {checkNotGuild} from "../../middleware/checkNotGuild.js";

export default {
    data: new SlashCommandBuilder()
        .setName('language')
        .setNameLocalizations({ru: `язык`, pl: `język`, uk: `мова`})
        .setDescription(`Set language for your server`)
        .setDescriptionLocalizations({
            ru: `Установить язык для вашего сервера`,
            pl: `Ustaw język dla swojego serwera`,
            uk: `Встановити мову для вашого сервера`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('language')
                .setNameLocalizations({ru: `язык`, pl: `język`, uk: `мова`})
                .setDescription('Choose the language for server')
                .setDescriptionLocalizations({
                    ru: `Выберите язык для сервера`,
                    pl: `Wybierz język dla serwera`,
                    uk: `Виберіть мову для сервера`
                })
                .addChoices(
                    [
                        {name: 'English', value: 'en'},
                        {name: 'Polski', value: 'pl'},
                        {name: 'Русский', value: 'ru'},
                        {name: 'Українська', value: 'uk'}
                    ]
                )
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const {guild, options} = interaction;
            const lang = await getLang(interaction);
            if (await checkNotGuild(interaction)) return;
            const guildId = guild!.id;
            const member = interaction.member as GuildMember;
            if (!member!.permissions.has(PermissionFlagsBits.ManageGuild)) return await interaction.reply({
                content: lang.error.commandformanageserver,
                ephemeral: true
            });
            const target = options.getString('language');
            await clearLangCache(guildId);
            await updateServer(guildId, 'lang', target);
            const updateLang = await getLang(interaction);
            const local = updateLang.language;

            const embed = new EmbedBuilder()
                .setTitle(local.title)
                .setDescription(`${local.description} ${target}`)
                .setColor(`#d998ff`);
            await interaction.reply({embeds: [embed], ephemeral: true});

        } catch (err) {
            await errorLog(err);
        }
    }
}