const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {getUserServer} = require('../../Data/funcs/db')
const {formatDate} = require("../../Data/utility");
const {getLang} = require("../../Data/Lang");

const getActivityType = (type) => {
    switch (type) {
        case 0:
            return 'play';
        case 1:
            return 'stream';
        case 2:
            return 'listen';
        case 3:
            return 'watch';
        case 4:
            return 'custom';
        case 5:
            return 'compete';
        default:
            return false;
    }
}

const getStatusEmoji = (status) => {
    switch (status) {
        case 'online':
            return '<:online:1294745413085302925>';
        case 'idle':
            return '<:idle:1294745429451473048>';
        case 'dnd':
            return '<:dnd:1294745439567876250>';
        case 'offline':
            return '<:invisible:1294745501941501952>';
        default:
            return '<:invisible:1294745501941501952>';
    }
}

const getBadgeEmoji = (badge) => {
    switch (badge) {
        case `HypeSquadOnlineHouse1`:
            return `<:badge_bravery:1295007106813919324>`;
        case `HypeSquadOnlineHouse2`:
            return `<:badge_brillance:1295007063281242173>`;
        case `HypeSquadOnlineHouse3`:
            return `<:badge_balance:1295007143807811614>`;
        case `ActiveDeveloper`:
            return `<:badge_active:1295006989025542205>`;
    }
}

module.exports = {
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
        const local = lang.user;
        try {
            const target = interaction.options.getUser('user');
            const getUser = target ?? interaction.user;
            const user = await getUser.fetch();
            const userID = user.id;
            const member = await interaction.guild.members.fetch(userID);
            if (!member) return await interaction.reply({content: local.notFound, ephemeral: true});
            const userColor = member.displayColor;
            const guildID = interaction.guild.id;
            const rolesList = member.roles.cache.filter(role=>role.id!==interaction.guild.id).reverse().map(role => role.toString()).join(' ');
            const rolesCount = member.roles.cache.size-1;
            const status = member.presence?.status || 'offline';
            const activityType = getActivityType(member.presence?.activities[0]?.type);
            const activityName = member.presence?.activities[0]?.name;
            const activityState = member.presence?.activities[0]?.state;
            const avatar = user.avatarURL({size: 4096});
            const banner = user.bannerURL({size: 4096});

            let bage = member.user.flags.toArray().map(badge => getBadgeEmoji(badge)).join(' ');
            const nitro = member.premiumSince;
            if (nitro) bage += ` <a:nitro_gif:1295015596710432859> <:nitro_subscriber:1295015733226377256>`;
            if (banner) bage += ` <a:nitro_gif:1295015596710432859> <:nitro_subscriber:1295015733226377256>`;
            if (user.bot) bage = `<a:code:1297250463644782643>`;


            const getUserArray = await getUserServer(userID, guildID);
            const userInfo = getUserArray[0] || {};
            const shards = userInfo.shards ?? 0;
            const aura = userInfo.aura ?? 0;

            const embed = new EmbedBuilder()
                .setTitle(`${local.title} — ${user.displayName}`)
                .setColor(userColor)
                .setDescription(`<:user:1297197580903645319> **${local.username}** \`${user.username}\` \n`+
                    `<:date:1297196424882294796> **${local.reg}**: \`${formatDate(user.createdAt)}\`\n` +
                    `<:date:1297196424882294796> **${local.entry}**: \`${formatDate(member.joinedAt)}\`\n` +
                    `<:moon:1297194475780575242> **${local.status}**: ${getStatusEmoji(status)} ${local.statusName[status]}\n` +
                    (bage ? `<:badge:1297195546041385042> **${local.badge}**: ${bage}\n` : ``) +
                    (activityType ? `<:activity:1297194463776604233> **${local.active}**: ${activityType === `custom` ? activityState : (local.activity[activityType] + ` ` + activityName)}\n` : ` `) +
                    `<:Roles:1297191708848689166> **${local.role}[${rolesCount}]**: ${rolesList}\n` +
                    `<:shard:1296969847690760234> **${local.shard}**: ${shards}\n` +
                    `<:aura:1297189989498753076> **${local.aura}**: ${aura}`)
                .setFooter({text: `${local.user_id}: ${userID}`});
            if (avatar) embed.setThumbnail(avatar);
            if (banner) embed.setImage(banner);

            await interaction.reply({embeds: [embed]});

        } catch (error) {
            console.error(error);
            await interaction.reply({content: local.error, ephemeral: true});
        }
    },
};