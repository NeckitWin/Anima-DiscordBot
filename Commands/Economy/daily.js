import {EmbedBuilder, SlashCommandBuilder} from 'discord.js';
import errorLog from "../../Utils/errorLog.js";
import {getLang} from "../../Utils/lang.js";
import {addShards} from "../../Repo/shardsRepository.js";
import {emoji} from "../../Components/emoji.js";
import {setCooldown} from "../../Utils/customCooldown.js";

const gifs = [
    "https://c.tenor.com/Z-rRh8JmyQ8AAAAC/tenor.gif",
    "https://c.tenor.com/lT8-b6zoQXoAAAAC/tenor.gif",
    "https://c.tenor.com/gcBDVr-ZNgUAAAAC/tenor.gif",
    "https://c.tenor.com/VwEthO6mhAEAAAAC/tenor.gif",
    "https://i.pinimg.com/originals/01/e4/46/01e446b7932532ab08ddee8c8b59ff3d.gif",
    "https://i.imgur.com/f8vW9zi.gif"
    ]

export  default {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setNameLocalizations({ ru: 'ежедневка', pl: 'dzienna', uk: 'щоденна' })
        .setDescription("Claim your daily bonus")
        .setDescriptionLocalizations({
            ru: "Забрать ежедневную бонус",
            pl: "Odbierz dzienną nagrodę",
            uk: "Отримати щоденну нагороду"
        }),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const local = lang.daily;
            const {user, guild} = interaction;
            const minShards = 5;
            const maxShards = 10;
            const shardsCount = Math.floor(Math.random() * (maxShards - minShards + 1)) + minShards;
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
            const day = 60 * 24;
            if (!await setCooldown("daily", interaction, day)) return;

            const embedLoading = new EmbedBuilder()
                .setColor('#00ffc4')
                .setDescription(`${emoji.loading} ${local.load}`);

            const embed = new EmbedBuilder()
                .setTitle(local.title)
                .setColor('#00ff00')
                .setDescription(`${local.description} ${shardsCount} ${emoji.shard}`)
                .setImage(randomGif)

            await interaction.reply({embeds: [embedLoading]});

            await addShards(user.id, guild.id, user.username, user.displayName, shardsCount );

            await interaction.editReply({embeds: [embed]});

        } catch (err) {
            await errorLog(err);
        }
    }

}