import {SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {getUserServer, getRelation} from '../../Repo/dbUser.js';
import {formatDate, getStatusEmoji, getActivityType, getBadgeEmoji} from "../../Utils/utility.js";
import {getLang} from "../../Utils/lang.js";
import errorLog from "../../Utils/errorLog.js";

export default {
    data: new SlashCommandBuilder()
        .setName('user')
        .setNameLocalizations({ru: 'пользователь', pl: 'użytkownik', uk: 'користувач'})
        .setDescription('Shows information about a user or about a user that was mentioned')
        .setDescriptionLocalizations({
            ru: "Показывает информацию о пользователе или о пользователе, которого упомянули",
            pl: "Pokazuje informacje o użytkowniku lub o użytkowniku, którego wspomniano",
            uk: "Показує інформацію про користувача або про користувача, якого згадали"
        })
        .addUserOption(option => option
            .setName('user')
            .setNameLocalizations({
                ru: "пользователь",
                pl: "użytkownik",
                uk: "користувач"
            })
            .setDescription('Select a participant to display information'))
        .setDescriptionLocalizations({
            ru: "Выберите участника для отображения информации",
            pl: "Wybierz uczestnika, aby wyświetlić informacje",
            uk: "Виберіть учасника для відображення інформації"
        }),
    async execute(interaction) {
        const lang = await getLang(interaction);
        if (!interaction.guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});
        const local = lang.user;
        try {
            const target = interaction.options.getUser('user');
            const getUser = target ?? interaction.user;
            const user = await getUser.fetch();
            const userID = user.id;
            const member = await interaction.guild.members.fetch(userID);
            if (!member) return await interaction.reply({content: lang.error.usernotfound, ephemeral: true});
            const userColor = member.displayColor;
            const guildID = interaction.guild.id;
            const highestRole = member.roles.highest;
            const rolesCount = member.roles.cache.size - 1;
            const status = member.presence?.status || 'offline';
            const activityType = getActivityType(member.presence?.activities[0]?.type);
            const activityName = member.presence?.activities[0]?.name;
            const activityState = member.presence?.activities[0]?.state;
            const avatar = user.avatarURL({size: 4096});
            const banner = user.bannerURL({size: 4096});

            let bage = member.user.flags.toArray().map(badge => getBadgeEmoji(badge)).join(' ');
            const nitro = member.premiumSince;
            if (nitro || banner) bage += ` <a:nitro_gif:1295015596710432859> <:nitro_subscriber:1295015733226377256>`;
            if (user.bot) bage = `<a:code:1297250463644782643>`;

            const getUserArray = await getUserServer(userID, guildID);
            const userInfo = getUserArray[0] || {};
            const shards = userInfo.shards ?? 0;
            const aura = userInfo.aura ?? 0;
            const getMarried = await getRelation(guildID, userID);
            const relation = getMarried && getMarried.length > 0 ? getMarried[0] : false;
            const relationUser = relation && relation.userID1 === userID ? relation.userID2 : relation.userID1;

            const embed = new EmbedBuilder()
                .setTitle(`${local.title} — ${user.displayName}`)
                .setColor(userColor)
                .setDescription(`<:user:1297197580903645319> **${local.username}** \`${user.username}\` \n` +
                    `<:date:1297196424882294796> **${local.reg}**: \`${formatDate(user.createdAt)}\`\n` +
                    `<:date:1297196424882294796> **${local.entry}**: \`${formatDate(member.joinedAt)}\`\n` +
                    `<:moon:1297194475780575242> **${local.status}**: ${getStatusEmoji(status)} ${local.statusName[status]}\n` +
                    (bage ? `<:badge:1297195546041385042> **${local.badge}**: ${bage}\n` : ``) +
                    (activityType ? `<:activity:1297194463776604233> **${local.active}**: ${activityType === `custom` ? (activityState ?? `\`❔\`\n`) : (local.activity[activityType] + ` ` + activityName)}\n` : ` `) +
                    `<:Roles:1297191708848689166> **${local.role}[${rolesCount}]**: ${highestRole}\n` +
                    (relation ? `<:hearts:1300282044047429682> ${local.married} <@${relationUser}>\n` : ``) +
                    `<:shard:1296969847690760234> **${local.shard}**: ${shards}\n` +
                    `<:aura:1297189989498753076> **${local.aura}**: ${aura}`
                )
                .setFooter({text: `${local.user_id}: ${userID}`});
            if (avatar) embed.setThumbnail(avatar);
            if (banner) embed.setImage(banner);

            await interaction.reply({embeds: [embed]});
        } catch (err) {
            await errorLog(err);
            await interaction.reply({content: lang.error.usernotfound, ephemeral: true});
        }
    },
};