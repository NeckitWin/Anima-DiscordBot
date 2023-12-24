// Команда "bot" показывает информацию о боте

const { SlashCommandBuilder } = require("discord.js");

console.log("command Info/bot.js loaded✅");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setNameLocalizations({ ru: 'бот', pl: 'bot', uk: 'бот' })
        .setDescription('Показывает информацию о боте')
        .setDescriptionLocalizations({ ru: 'Показывает информацию о боте', pl: 'Pokazuje informacje o bocie', uk: 'Показує інформацію про бота' }),
    async execute(interaction) {
        const locale = interaction.guild?.preferredLocale || 'default';
        const embed = {
            color: 0x0099ff,
            title: {
                ru: 'Информация о боте Anima',
                pl: 'Informacje o bocie Anima',
                uk: 'Інформація про бота Anima',
                default: 'Information about the bot Anima',
            }[locale] || 'Information about the bot Anima',
            thumbnail: {
                url: interaction.client.user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: {
                        ru: 'Меня зовут Anima',
                        pl: 'Mam na imię Anima',
                        uk: 'Мене звуть Anima',
                        default: 'My name is Anima',
                    }[locale] || 'My name is Anima',
                    value: '',
                    inline: true,
                },
                {
                    name: {
                        ru: 'Мой ID',
                        pl: 'Moje ID',
                        uk: 'Мій ID',
                        default: 'My ID',
                    }[locale] || 'My ID',
                    value: interaction.client.user.id,
                    inline: false,
                },
                {
                    name: {
                        ru: 'Когда я была создана',
                        pl: 'Kiedy zostałam stworzona',
                        uk: 'Коли я була створена',
                        default: 'When I was created',
                    }[locale] || 'When I was created',
                    value: interaction.client.user.createdAt.toLocaleTimeString("en-US", { timeZone: "America/New_York", day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }),
                    valueLocalizations: {
                        ru: interaction.client.user.createdAt.toLocaleTimeString("ru-RU", { timeZone: "Europe/Moscow", day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }),
                        pl: interaction.client.user.createdAt.toLocaleTimeString("pl-PL", { timeZone: "Europe/Warsaw", day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }),
                        uk: interaction.client.user.createdAt.toLocaleTimeString("uk-UA", { timeZone: "Europe/Kiev", day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }),
                    },
                    inline: true,
                }
            ],
        };
        embed.title = embed.titleLocalizations?.[locale] || embed.title;

        embed.fields.forEach((field) => {
            field.name = field.nameLocalizations?.[locale] || field.name;
            field.value = field.valueLocalizations?.[locale] || field.value;
        });

        interaction.reply({ embeds: [embed] });
    }
};
