import {SlashCommandBuilder, ActionRowBuilder} from "discord.js";
import { getLang } from "../../Utils/lang.js";
import {helpEmbed} from "../../Components/Embeds/helpEmbed.js";
import {menuHelp} from "../../Components/Menus/helpMenu.js";
import errorLog from "../../Utils/errorLog.js";

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