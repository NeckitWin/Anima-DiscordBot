const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`);
const {getServer} = require("../../Data/funcs/dbServer");
const {getLang} = require("../../Data/Lang");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anonim-message')
        .setNameLocalizations({ru: 'анонимное-сообщение', pl: 'anonimowa-wiadomość', uk: 'анонімне-повідомлення'})
        .setDescription('Send an anonim message in anonim channel of the server')
        .setDescriptionLocalizations({
            ru: 'Отправить анонимное сообщение в анонимном канале сервера',
            pl: 'Wyślij anonimową wiadomość w anonimowym kanale serwera',
            uk: 'Відправити анонімне повідомлення в анонімному каналі сервера'
        })
        .addStringOption(option => option
            .setName(`message`)
            .setNameLocalizations({ru: 'сообщение', pl: 'wiadomość', uk: 'повідомлення'})
            .setDescription('Enter the anonim message')
            .setDescriptionLocalizations({
                ru: 'Введите анонимное сообщение',
                pl: 'Wprowadź anonimową wiadomość',
                uk: 'Введіть анонімне повідомлення'
            })
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName(`user`)
            .setNameLocalizations({ru: 'пользователь', pl: 'użytkownik', uk: 'користувач'})
            .setDescription('Choose the user to whom the message is intended')
            .setDescriptionLocalizations({
                ru: 'Выберите пользователя, которому предназначено сообщение',
                pl: 'Wybierz użytkownika, któremu jest przeznaczona wiadomość',
                uk: 'Виберіть користувача, якому призначено повідомлення'
            })
        ),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const local = lang.anonim;
            const {guild} = interaction;
            const anonimMessage = interaction.options.getString(`message`);
            const targetUser = interaction.options.getUser(`user`);
            const dataServer = await getServer(guild.id, guild.name);
            const embedErr = new EmbedBuilder()
                .setTitle(lang.error.error)
                .setColor('#cc0000');

            const anonimEmbed = new EmbedBuilder()
                .setTitle(local.anonimMessageTitle)
                .setColor('#eeffe4')
                .setDescription(anonimMessage)
                .setFooter({text: `${local.botNotResponsible}\n${local.forSend} /anonim-message`, iconURL: guild.iconURL()});

            if (dataServer.anonim == 0) {
                embedErr.setDescription(`${local.channelNotSet} </anonim-messages set:1302707977546895472>`);
                return interaction.reply({embeds: [embedErr], ephemeral: true});
            }

            const anonimChannel = guild.channels.cache.get(dataServer.anonim);
            await anonimChannel.send({
                content: (targetUser ? `${targetUser} ${local.youGetMessage}` : ``),
                embeds: [anonimEmbed]
            });

            const embedSuccess = new EmbedBuilder()
                .setTitle(local.successTitle)
                .setDescription(`${local.messageSent} ${anonimChannel}`)
                .setColor('#77b255');

            await interaction.reply({embeds: [embedSuccess], ephemeral: true});
        } catch (err) {
            console.error(err);
        }
    }
}