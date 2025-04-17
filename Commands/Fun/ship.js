import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch2';
import path from 'node:path';
import url from 'node:url';
import sharp from 'sharp';
import { getLang } from "../../Utils/lang.js";

const getCircleBufferImage = async (url, size = 200, shadowColor = 'rgba(255, 0, 0, 0.5)', shadowOffset = 10) => {
    const response = await fetch(url);
    const buffer = await response.buffer();

    const image = sharp(buffer).resize(size, size);

    const svgCircle = `<svg width="${size}" height="${size}">
                          <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white" />
                      </svg>`;
    const circleBuffer = Buffer.from(svgCircle);

    const circularImage = await image
        .composite([{input: circleBuffer, blend: 'dest-in'}])
        .png()
        .toBuffer();

    const svgShadow = `<svg width="${size + shadowOffset * 2}" height="${size + shadowOffset * 2}">
                          <circle cx="${(size + shadowOffset * 2) / 2}" cy="${(size + shadowOffset * 2) / 2}" r="${(size + shadowOffset) / 2}" fill="${shadowColor}" />
                      </svg>`;
    const shadowBuffer = Buffer.from(svgShadow);

    const shadow = await sharp(shadowBuffer)
        .blur(10)
        .toBuffer();

    return await sharp(shadow)
        .composite([{input: circularImage, top: shadowOffset, left: shadowOffset, blend: 'over'}])
        .png()
        .toBuffer();
}

const createTextSVG = (text, fontSize, fillColor = 'white', strokeColor, strokeWidth, center = false) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="${fontSize + 10}" ${center ? 'width="240"' : ''}>
                <text x="${center ? '50%' : '0'}" y="${fontSize}" font-size="${fontSize}" font-family="Comic Sans MS, cursive, sans-serif" fill="${fillColor}" 
                       ${strokeColor ? `stroke="${strokeColor}"` : ''} 
                       stroke-width="${strokeWidth}" text-anchor="${center ? 'middle' : 'start'}" dominant-baseline="hanging" font-weight="bold">
                      ${text}
                </text>
            </svg>`;
};


export default {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('ship')
        .setNameLocalizations({ru: `пара`, pl: `para`, uk: `пара`})
        .setDescription('Find out users compatibility')
        .setDescriptionLocalizations({
            ru: `Узнайте совместимость пользователей`,
            pl: `Sprawdź zgodność użytkowników`,
            uk: `Дізнайтеся сумісність користувачів`
        })
        .addUserOption(option => option
            .setName('user1')
            .setNameLocalizations({ru: 'пользователь1', pl: 'użytkownik1', uk: 'користувач1'})
            .setDescription('First user to ship')
            .setDescriptionLocalizations({
                ru: 'Первый пользователь для совместимости',
                pl: 'Pierwszy użytkownik do połączenia',
                uk: 'Перший користувач для злиття'
            })
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName('user2')
            .setNameLocalizations({ru: 'пользователь2', pl: 'użytkownik2', uk: 'користувач2'})
            .setDescription('Second user to ship')
            .setDescriptionLocalizations({
                ru: 'Второй пользователь для совместимости',
                pl: 'Drugi użytkownik do połączenia',
                uk: 'Другий користувач для злиття'
            })
            .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const embedLoading = new EmbedBuilder()
                .setTitle(`<a:loading:1295096250609172611> ${lang.ai.loading}...`)
                .setColor(`#ff0062`);
            await interaction.reply({embeds: [embedLoading]});
            const user1 = interaction.options.getUser('user1');
            const user2 = interaction.options.getUser('user2');

            if (user1.id === user2.id) {
                embedLoading.setTitle(lang.error.otherpeople).setColor(`#bf0000`);
                return interaction.editReply({embeds: [embedLoading]});
            }

            const userAvatar1 = await getCircleBufferImage(user1.avatarURL({size: 256}));
            const userAvatar2 = await getCircleBufferImage(user2.avatarURL({size: 256}));
            const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
            const bgPath = path.join(__dirname, "../../Data/img/heartbg.png");
            const bgImage = sharp(bgPath);
            const randomNumber = Math.floor(Math.random() * (100 + 1));

            const textSVG = createTextSVG((randomNumber+"%"), 80, 'white','#450000', 3, true)

            const result = await bgImage
                .composite([
                    {input: userAvatar1, top: 100, left: 0},
                    {input: userAvatar2, top: 100, left: 440},
                    {input: Buffer.from(textSVG), top: 110, left: 210}
                ]).toBuffer();

            await interaction.editReply({content:`${user1} ${user2}`, embeds: [], files: [result]});

        } catch (e) {
            console.error(e);
        }
    }
}