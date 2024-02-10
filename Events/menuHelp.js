const {Events, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder} = require('discord.js');
const {rowForHelpEx} = require('../Commands/Info/help.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Обработка выбора меню
        if (interaction.isAnySelectMenu() && interaction.customId === 'menuHelp') {
            const menuHelpEvent = new StringSelectMenuBuilder()
                .setCustomId('menuHelp')
                .setPlaceholder('Узнать поподробнее о командах')
                .addOptions([
                    {
                        label: 'Информация',
                        description: 'Информационные команды',
                        value: 'info',
                        emoji: '📚',
                    },
                    {
                        label: 'Администрация',
                        description: 'Команды для администрации',
                        value: 'admin',
                        emoji: '👑',
                    },
                    {
                        label: 'Модерация',
                        description: 'Команды для модерации',
                        value: 'moderation',
                        emoji: '👮‍♂️',
                    },
                    {
                        label: 'Утилиты',
                        description: 'Команды для утилит',
                        value: 'utils',
                        emoji: '🔧',
                    },
                    {
                        label: 'Игры',
                        description: 'Команды для игр',
                        value: 'games',
                        emoji: '🎮',
                    },
                    {
                        label: 'Веселье',
                        description: 'Веселые команды',
                        value: 'fun',
                        emoji: '🎉',
                    },
                ]);

            const rowForHelpEvent = new ActionRowBuilder()
                .addComponents(menuHelpEvent);
            const selectedOption = interaction.values[0];
            let embed;

            switch (selectedOption) {
                case 'info':
                    embed = new EmbedBuilder()
                        .setTitle('Информационные команды 📚')
                        .setDescription("</help:1188221601343357056> - Показывает список команд \n" +
                            "</bot:1188217557883293727> - Показывает информацию о боте \n" +
                            "</user:1188217557883293728> - Показывает информацию о пользователе \n" +
                            "</avatar_banner:1188538123521642586> - Показывает аватарку пользователя \n" +
                            "</user:1188217557883293728> - Показывает информацию о пользователе \n" +
                            "</server:1204559755503468564> - Показывает информацию о сервере");
                    break;
                case 'admin':
                    embed = new EmbedBuilder()
                        .setTitle('Команды для администрации 👑')
                        .setDescription("</ban:1204559755503468565> - Банит пользователя");
                    break;
                case 'moderation':
                    embed = new EmbedBuilder()
                        .setTitle('Команды для модерации 👮‍♂️')
                        .setDescription("</ban:1204559755503468565> - Банит пользователя \n" +
                            "</kick:1204559755503468566> - Кикает пользователя \n" +
                        "</mute:1204559755503468567> - Мутит пользователя \n" +
                        "</clear:1188291249225084958> - Очищает чат на определенное количество сообщений");
                    break;
                case 'utils':
                    embed = new EmbedBuilder()
                        .setTitle('Команды для утилит 🔧')
                        .setDescription("</ping:1204559755964846100> - Показывает пинг бота \n" +
                            "</offer:1204559755503468568> - Предложить идею на голосование");
                    break;
                case 'games':
                    embed = new EmbedBuilder()
                        .setTitle('Команды для игр 🎮')
                        .setDescription("</russian-roulette:1204801418028912650> - Игра в русскую рулетку");
                    break;
                case 'fun':
                    embed = new EmbedBuilder()
                        .setTitle('Веселые команды 🎉')
                        .setDescription("</randomanime:> - Показывает случайное аниме");
                    break;
            }
            await interaction.update({embeds: [embed], components: [rowForHelpEvent]});
        }
    }
}