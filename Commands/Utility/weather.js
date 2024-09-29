const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
const lang = require('../../Data/Lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setNameLocalizations({ru: 'погода', pl: 'pogoda', uk: 'погода'})
        .setDescription('Shows the weather in a city')
        .setDescriptionLocalizations({
            ru: 'Показывает погоду в городе',
            pl: 'Pokazuje pogodę w mieście',
            uk: 'Показує погоду в місті'
        })
        .addStringOption(option => option
            .setName('city')
            .setNameLocalizations({ru: 'город', pl: 'miasto', uk: 'місто'})
            .setDescription('City to get the weather of')
            .setDescriptionLocalizations({
                ru: 'Город, погоду которого нужно получить',
                pl: 'Miasto, w którym chcesz sprawdzić pogodę',
                uk: 'Місто, погоду якого потрібно отримати'
            })
            .setRequired(true)),
    async execute(interaction) {
        try {
            let preferredLang = interaction.guild.preferredLocale;
            if (!lang.hasOwnProperty(preferredLang)) {
                preferredLang = 'en';
            }
            let info;
            let local = lang[preferredLang].weather;
            const city = interaction.options.getString('city');
            await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=3d9de74844d28377e81415151cbe6a66`)
                .then(res => (info = res))
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle(local.title)
                .setDescription(`⚡ **${local.description1}:**\n\`\`\`js\n${city} \`\`\`\n🌅 **${local.description2}:**\n\`\`\`js\n${Math.round(info.data.main.temp)}°C \n\`\`\``)
                .addFields({
                        name: `🌡️ ${local.feelslike}:`,
                        value: `\`\`\`js\n${Math.round(info.data.main.temp)}°C\`\`\``,
                        inline: true
                    }, {
                        name: `🌡️ ${local.min}:`,
                        value: `\`\`\`js\n${Math.round(info.data.main.temp_min)}°C\`\`\``,
                        inline: true
                    }, {
                        name: `🌡️ ${local.max}:`,
                        value: `\`\`\`js\n${Math.round(info.data.main.temp_max)}°C\`\`\``,
                        inline: true
                    }, {
                        name: `💧 ${local.humidity}:`,
                        value: `\`\`\`js\n${info.data.main.humidity}%\`\`\``,
                        inline: true
                    }, {
                        name: `🌡️ ${local.pressure}:`,
                        value: `\`\`\`js\n${info.data.main.pressure}hPa\`\`\``,
                        inline: true
                    }, {
                        name: `🌬️ ${local.wind}:`,
                        value: `\`\`\`js\n${info.data.wind.speed}m/s\`\`\``,
                        inline: true
                    }, {
                        name: `🌬️ ${local.clouds}:`,
                        value: `\`\`\`js\n${info.data.clouds.all}%\`\`\``,
                        inline: true
                    }
                )
                .setThumbnail("https://cdn.dribbble.com/users/2120934/screenshots/6193524/19_mostlysunny.gif");

            await interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error(error);
            console.log('An error occurred while calculating the expression.');
        }
    },
}