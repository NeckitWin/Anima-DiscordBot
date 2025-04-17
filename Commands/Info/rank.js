import {Attachment, AttachmentBuilder, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import { createCanvas, loadImage } from "canvas";
import errorLog from "../../Utils/errorLog.js";

export default {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setNameLocalizations({ru: "ранг", pl: "ranga", uk: "ранг"})
        .setDescription("Shows your rank")
        .setDescriptionLocalizations({
            ru: "Показывает ваш ранг",
            pl: "Pokazuje twój rangę",
            uk: "Показує ваш ранг"
        }),
    async execute(interaction) {
        try {
            const userAvatar = interaction.user.avatarURL({format: "png", extension: "png"});
            const canvas = createCanvas(1000, 450);
            const ctx = canvas.getContext("2d");

            await loadImage('./Data/img/animebg.jpg').then((image) => {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.width);
            })

            await loadImage(userAvatar).then((image) => {
                const avatarX = 50;
                const avatarY = 50;
                const avatarSize = 350;

                ctx.arc(
                    avatarX + avatarSize / 2,
                    avatarY + avatarSize / 2,
                    avatarSize / 2,
                    0,
                    Math.PI * 2
                );
                ctx.clip();

                ctx.drawImage(image, 50, 50, 350, 350);
            })

            const buffer = canvas.toBuffer('image/jpeg');

            await interaction.reply({files: [buffer]})
        } catch (err) {
            await errorLog(err);
        }
    }
}