const { Events, Message } = require('discord.js');

console.log('Events/emoji loaded✅');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Проверка, является ли сообщение текстовым
        if (!message.guild || !message.content) return;

        // Счетчик сообщений
        let messageCount = 0;

        // Обработчик события MessageCreate
        message.client.on(Events.MessageCreate, async (message) => {
            // Увеличение счетчика
            messageCount++;

            // Генерация случайного числа
            const randomNumber = Math.floor(Math.random() * 20);

            // Проверка на реакцию
            if (randomNumber === messageCount && messageCount === 10) {
                // Сброс счетчика
                messageCount = 0;

                // Получение списка эмодзи сервера
                const emojis = message.guild.emojis.cache;

                // Выбор случайного эмодзи
                const randomEmoji = emojis.random();

                // Добавление реакции к 10-ому сообщению
                await message.react(randomEmoji);
            }
        });
    },
};
