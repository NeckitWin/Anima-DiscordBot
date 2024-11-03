const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require(`discord.js`);
const {updateServer, getServer} = require("../../Data/funcs/dbServer");
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anonim-messages')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNameLocalizations({ru: 'анонимные-сообщения', pl: 'anonimowe-wiadomości', uk: 'анонімні-повідомлення'})
        .setDescription('Set the channel for anonim messages')
        .setDescriptionLocalizations({
            ru: 'Установка канала для анонимных сообщений на вашем сервере',
            pl: 'Ustaw kanał dla anonimowych wiadomości na swoim serwerze',
            uk: 'Встановлення каналу для анонімних повідомлень на вашому сервері'
        })
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setNameLocalizations({ru: 'установить', pl: 'ustaw', uk: 'встановити'})
            .setDescription('Set the channel for anonim messages')
            .setDescriptionLocalizations({
                ru: 'Установить канал для анонимных сообщений',
                pl: 'Ustaw kanał dla anonimowych wiadomości',
                uk: 'Встановити канал для анонімних повідомлень'
            })
            .addChannelOption(option => option
                .setName('channel')
                .setNameLocalizations({ru: 'канал', pl: 'kanał', uk: 'канал'})
                .setDescription('Choose the channel for anonim messages')
                .setDescriptionLocalizations({
                    ru: 'Выберите канал для анонимных сообщений',
                    pl: 'Wybierz kanał dla anonimowych wiadomości',
                    uk: 'Виберіть канал для анонімних повідомлень'
                })
                .setRequired(false))
        )
        .addSubcommand(subcommand => subcommand
            .setName('disable')
            .setNameLocalizations({ru: 'отключить', pl: 'wyłącz', uk: 'вимкнути'})
            .setDescription('Disable the channel for anonim messages')
            .setDescriptionLocalizations({
                ru: 'Отключить канал для анонимных сообщений',
                pl: 'Wyłącz kanał dla anonimowych wiadomości',
                uk: 'Вимкнути канал для анонімних повідомлень'
            })
        ),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const local = lang.anonim;
            const subcommand = interaction.options.getSubcommand();
            const {guild} = interaction;
            const dataServer = await getServer(guild.id, guild.name);

            const embedSuccess = new EmbedBuilder()
                .setTitle(local.systemTitle)
                .setColor('#77b255');

            const embedErr = new EmbedBuilder()
                .setTitle(lang.error.error)
                .setColor('#cc0000');

            if (subcommand === 'set') {
                const targetChannel = interaction.options?.getChannel('channel') || interaction.channel;

                if (dataServer.anonim != 0) {
                    embedErr.setDescription(local.channelAlreadySet);
                    return await interaction.reply({embeds: [embedErr], ephemeral: true});
                }

                if (targetChannel.type !== 0) {
                    embedErr.setDescription(local.textChannelOnly);
                    return await interaction.reply({embeds: [embedErr], ephemeral: true});
                }

                await updateServer(guild.id, `anonim`, targetChannel.id);

                const embed = new EmbedBuilder()
                    .setTitle(local.systemTitle)
                    .setDescription(`${local.botDisclaimer} **${guild.name} (ID:\`${guild.id}\`)** ${local.botDisclaimer2} </anonim-messages disable:1302707977546895472>\n\n${local.forSend} </anonim-message:1302707978008531125>`)
                    .setThumbnail(guild.iconURL({dynamic: true}))
                    .setColor('#ff9cb3');

                embedSuccess.setDescription(`${local.successSet} ${targetChannel}`);
                await interaction.reply({embeds: [embedSuccess], ephemeral: true});
                await targetChannel.send({embeds: [embed]});

            } else if (subcommand === `disable`) {

                if (dataServer.anonim == 0) {
                    embedErr.setDescription(local.channelHasntSet);
                    return await interaction.reply({embeds: [embedErr]});
                }

                await updateServer(guild.id, `anonim`, 0);

                embedSuccess.setDescription(`${local.successDisable} <#${dataServer.anonim}>`);

                await interaction.reply({embeds: [embedSuccess]});
            }
        } catch (err) {
            console.error(err);
        }
    }
}