import {SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ChatInputCommandInteraction} from 'discord.js';
import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';
import path from 'node:path';
import url from 'node:url';
import { getLang } from "../../utils/lang.ts";
import errorLog from "../../utils/errorLog.ts";

async function createCircularAvatar(imageUrl: string, size = 200, shadowColor = 'rgba(255, 0, 0, 0.5)', shadowBlur = 10) {
    const canvas = createCanvas(size + shadowBlur * 2, size + shadowBlur * 2);
    const ctx = canvas.getContext('2d');

    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const image = await loadImage(Buffer.from(buffer));

    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 + shadowBlur / 2, 0, Math.PI * 2);
    ctx.fillStyle = shadowColor;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(image, shadowBlur, shadowBlur, size, size);
    ctx.restore();

    return canvas;
}

function createText(text: string, fontSize: number, fillColor = 'white', strokeColor: string | null = null, strokeWidth: number = 0, center: boolean = false) {
    const canvas = createCanvas(240, fontSize + 10);
    const ctx = canvas.getContext('2d');

    ctx.font = `bold ${fontSize}px "Comic Sans MS", cursive, sans-serif`;
    ctx.textAlign = center ? 'center' : 'left';
    ctx.textBaseline = 'top';

    const x = center ? canvas.width / 2 : 0;
    const y = 0;

    if (strokeColor && strokeWidth) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(text, x, y);
    }

    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);

    return canvas;
}

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
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const lang = await getLang(interaction);

            const embedLoading = new EmbedBuilder()
                .setTitle(`<a:loading:1295096250609172611> ${lang.ai.loading}...`)
                .setColor(`#ff0062`);
            await interaction.reply({embeds: [embedLoading]});

            const user1 = interaction.options.getUser('user1')!;
            const user2 = interaction.options.getUser('user2')!;

            if (user1.id === user2.id) {
                embedLoading.setTitle(lang.error.otherpeople).setColor(`#bf0000`);
                return interaction.editReply({embeds: [embedLoading]});
            }

            const avatar1 = await createCircularAvatar(user1.displayAvatarURL({extension: 'png', size: 256}));
            const avatar2 = await createCircularAvatar(user2.displayAvatarURL({extension: 'png', size: 256}));

            const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
            const bgPath = path.join(__dirname, "../../../data/img/heartbg.png");
            const bgImage = await loadImage(bgPath);

            const compatibilityScore = Math.floor(Math.random() * 101);
            const scoreText = createText(`${compatibilityScore}%`, 80, 'white', '#450000', 3, true);

            const finalCanvas = createCanvas(bgImage.width, bgImage.height);
            const ctx = finalCanvas.getContext('2d');

            ctx.drawImage(bgImage, 0, 0);

            ctx.drawImage(avatar1, 0, 100);
            ctx.drawImage(avatar2, finalCanvas.width - avatar2.width, 100);

            ctx.drawImage(scoreText, (finalCanvas.width - scoreText.width) / 2, 110);

            const attachment = new AttachmentBuilder(finalCanvas.toBuffer(), {name: 'ship.png'});

            await interaction.editReply({
                content: `${user1} ${user2}`,
                embeds: [],
                files: [attachment]
            });

        } catch (err) {
            await errorLog(err);
        }
    }
}