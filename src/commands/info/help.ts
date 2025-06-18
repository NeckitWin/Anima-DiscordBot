import {SlashCommandBuilder, ActionRowBuilder} from "discord.js";
import { getLang } from "../../utils/lang.ts";
import {helpEmbed} from "../../components/embeds/helpEmbed.js";
import {menuHelp} from "../../components/menus/helpMenu.js";
import errorLog from "../../utils/errorLog.ts";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations({ru: 'помощь', pl: 'pomoc', uk: 'допомога'})
        .setDescription('Shows list of commands')
        .setDescriptionLocalizations({
            ru: 'Показывает список команд',
            pl: 'Pokazuje listę komend',
            uk: 'Показує список команд'
        }),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const embed = helpEmbed(interaction, lang);
            const helpSelectMenu = menuHelp(lang.menuhelp);
            const rowHelp = new ActionRowBuilder()
                .addComponents(helpSelectMenu);

            interaction.reply({embeds: [embed], components: [rowHelp],});
        } catch (err) {
            await errorLog(err);
        }
    },
};