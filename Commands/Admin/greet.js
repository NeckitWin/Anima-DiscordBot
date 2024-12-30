const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    PermissionFlagsBits,
    PermissionsBitField
} = require(`discord.js`);
const {getLang} = require("../../Data/Lang");
const {removeGreet} = require("../../Data/funcs/dbGreet");
const {commandLog} = require("../../Data/funcs/commandLog");
const commandName = 'greet';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setNameLocalizations({ru: `приветствие`, pl: `powitanie`, uk: `привітання`})
        .setDescription(`Set channel for greeting new members`)
        .setDescriptionLocalizations({
            ru: `Установить канал для приветствия новых участников`,
            pl: `Ustaw kanał dla powitania nowych członków`,
            uk: `Встановити канал для привітання нових учасників`
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setNameLocalizations({ru: `установить`, pl: `ustaw`, uk: `встановити`})
            .setDescription('Set the channel for greeting new members')
            .setDescriptionLocalizations({
                ru: `Установить канал для приветствия новых участников`,
                pl: `Ustaw kanał dla powitania nowych członków`,
                uk: `Встановити канал для привітання нових учасників`
            }).addChannelOption(option => option
                .setName('channel')
                .setNameLocalizations({ru: `канал`, pl: `kanał`, uk: `канал`})
                .setDescription('Choose the channel for greeting')
                .setDescriptionLocalizations({
                    ru: `Выберите канал для приветствия`,
                    pl: `Wybierz kanał dla powitania`,
                    uk: `Виберіть канал для привітання`
                })
                .setRequired(true)
            ))
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setNameLocalizations({ru: `удалить`, pl: `usuń`, uk: `видалити`})
            .setDescription('Remove greeting')
            .setDescriptionLocalizations({
                ru: `Удалить приветствие`,
                pl: `Usuń powitanie`,
                uk: `Видалити привітання`
            })),
    async execute(interaction) {
        try {
            if (!commandLog(commandName, interaction)) return;
            let modal;
            const {guild} = interaction;
            const lang = await getLang(interaction);
            if (!guild) return await interaction.reply({content: lang.error.notguild, ephemeral: true});
            const local = lang.greeting
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return await interaction.reply({
                    content: lang.error.commandforadmin,
                    ephemeral: true
                });
            }

            const serverID = interaction.guild.id;

            const subcommand = interaction.options.getSubcommand();
            if (subcommand === `set`) {
                const channel = interaction.options.getChannel(`channel`);
                if (channel.type !== 0) return interaction.reply({content: local.nottext, ephemeral: true});
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) return await interaction.reply({
                    content: lang.error.botdontpermsendmessage,
                    ephemeral: true
                });

                modal = new ModalBuilder()
                    .setTitle(local.title)
                    .setCustomId(`modalGreeting`);

                const greetingTitle = new TextInputBuilder()
                    .setCustomId('greetingTitle')
                    .setLabel(local.titlecontent)
                    .setPlaceholder(local.titleplace)
                    .setStyle(TextInputStyle.Short);

                const greetingContent = new TextInputBuilder()
                    .setCustomId('greetingContent')
                    .setLabel(local.content)
                    .setPlaceholder(local.contentplace)
                    .setStyle(TextInputStyle.Paragraph);

                const greetingPicture = new TextInputBuilder()
                    .setCustomId('greetingPicture')
                    .setLabel(local.picture)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder(`https://media.tenor.com/example.gif`)
                    .setRequired(false);

                const greetingChannel = new TextInputBuilder()
                    .setCustomId('greetingChannel')
                    .setLabel(local.channel)
                    .setStyle(TextInputStyle.Short)
                    .setValue(channel.id)
                    .setPlaceholder(channel.id)
                    .setRequired(true);

                const firstComponent = new ActionRowBuilder()
                    .addComponents(greetingTitle);

                const secondComponent = new ActionRowBuilder()
                    .addComponents(greetingContent);

                const thirdComponent = new ActionRowBuilder()
                    .addComponents(greetingPicture);

                const fourthComponent = new ActionRowBuilder()
                    .addComponents(greetingChannel);

                modal.addComponents(firstComponent, secondComponent, thirdComponent, fourthComponent);

                await interaction.showModal(modal);
                await interaction.followUp({content: local.response, ephemeral: true});

            } else if (subcommand === `remove`) {
                await removeGreet(serverID);
                interaction.reply({content: local.remove, ephemeral: true});
            }
        } catch (err) {
            console.error(err);
        }
    }
}