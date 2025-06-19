import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import data from "../../../data/jsons/reactions.json" with { type: 'json' };
import { getLang } from "../../utils/lang.ts";
import errorLog from "../../utils/errorLog.ts";
const maleEmoji = "♂️";
const femaleEmoji = "♀️";
export default {
    data: new SlashCommandBuilder()
        .setName('rp')
        .setNameLocalizations({ ru: "рп", pl: "rp", uk: "рп" })
        .setDescription("interaction with someone")
        .setDescriptionLocalizations({ ru: "взаимодействие с кем-то", pl: "interakcja z kimś", uk: "взаємодія з кимось" })
        .addStringOption(option => option.setName("reaction")
        .setNameLocalizations({ ru: "реакция", pl: "reakcja", uk: "реакція" })
        .setDescription("Choose your reaction")
        .setDescriptionLocalizations({
        ru: "Выберите вашу реакцию",
        pl: "Wybierz swoją reakcję",
        uk: "Виберіть вашу реакцію"
    })
        .addChoices(data.reaction)
        .setRequired(true))
        .addUserOption(option => option.setName("user")
        .setNameLocalizations({ ru: "пользователь", pl: "użytkownik", uk: "користувач" })
        .setDescription("Choose the user to interact with")
        .setDescriptionLocalizations({
        ru: "Выберите пользователя для взаимодействия",
        pl: "Wybierz użytkownika do interakcji",
        uk: "Виберіть користувача для взаємодії"
    })
        .setRequired(false))
        .addIntegerOption(option => option
        .setName(`gender`)
        .setNameLocalizations({ ru: `пол`, pl: `płeć`, uk: `стать` })
        .setDescription(`Choose your gender`)
        .setDescriptionLocalizations({
        ru: `Выберите ваш пол`,
        pl: `Wybierz swoją płeć`,
        uk: `Виберіть вашу стать`
    })
        .addChoices([
        {
            name: `${femaleEmoji} female`,
            name_localizations: {
                ru: `${femaleEmoji} женский`,
                pl: `${femaleEmoji} kobieta`,
                uk: `${femaleEmoji} жінка`
            },
            value: 1
        },
        {
            name: `${maleEmoji} male`,
            name_localizations: {
                ru: `${maleEmoji} мужской`,
                pl: `${maleEmoji} mężczyzna`,
                uk: `${maleEmoji} чоловік`
            },
            value: 2
        }
    ])
        .setRequired(false)),
    async execute(interaction) {
        try {
            const target = interaction.options.getString(`reaction`);
            const mentionUser = interaction.options.getUser(`user`);
            const gender = interaction.options.getInteger(`gender`);
            const lang = await getLang(interaction);
            const local = lang.rp;
            const embedError = new EmbedBuilder()
                .setColor("#ba0000");
            const action = mentionUser ? "interactions" : "reactions";
            const gifs = data[action][target];
            const filterGifs = gender ? gifs.filter(gif => gif.g === gender || gif.g === 3) : gifs;
            const randomGif = filterGifs[Math.floor(Math.random() * filterGifs.length)];
            const embed = new EmbedBuilder()
                .setAuthor({ name: ` `, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${interaction.user} ${local[action][target]}` + (mentionUser ? ` ${mentionUser}` : ""))
                .setImage(randomGif.gif);
            if (action === "interactions") {
                if (interaction.user.id === mentionUser.id)
                    return await interaction.reply({
                        embeds: [embedError.setTitle(lang.error.dontyourself)],
                        ephemeral: true
                    });
                if (!interaction.guild.members.cache.get(mentionUser.id))
                    return await interaction.reply({
                        embeds: [embedError.setTitle(lang.error.usernotfound)],
                        ephemeral: true
                    });
                await interaction.reply({ embeds: [embed] });
            }
            else {
                await interaction.reply({ embeds: [embed] });
            }
        }
        catch (err) {
            await errorLog(err);
        }
    }
};
