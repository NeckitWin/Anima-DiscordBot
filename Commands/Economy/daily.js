import {EmbedBuilder, SlashCommandBuilder} from 'discord.js';
import errorLog from "../../Utils/errorLog.js";
import {getLang} from "../../Utils/lang.js";
import {addShards} from "../../Repo/shardsRepository.js";

const imgs = [
    "https://i.pinimg.com/originals/34/17/f4/3417f49a547682eb7b18c17ef8476f09.gif",
    "https://media0.giphy.com/media/fhAwk4DnqNgw8/giphy.gif?cid=6c09b952wtump61pv10txtb0ddfj5jf1f9po99h21yngurot&ep=v1_gifs_search&rid=giphy.gif",
    "https://i.pinimg.com/originals/72/7e/1e/727e1e04dd7530a235df0c3b05a8a357.gif",
]

export  default {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setNameLocalizations({ ru: 'ежедневка', pl: 'dzienna', uk: 'щоденна' })
        .setDescription("Claim your daily reward")
        .setDescriptionLocalizations({
            ru: "Забрать ежедневную награду",
            pl: "Odbierz dzienną nagrodę",
            uk: "Отримати щоденну нагороду"
        }),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const minShards = 1;
            const maxShards = 10;
            const {user, guild} = interaction;
            const shardsCount = Math.floor(Math.random() * (maxShards - minShards + 1)) + minShards;

            const embed = new EmbedBuilder()
                .setTitle("💼 Работаю..")
                .setDescription("Тратим время на тяжкий труд, чтобы заработать осколки...")
                .setColor("#d998ff")
                .setImage(imgs[Math.floor(Math.random() * imgs.length)]);

            await addShards(user.id, guild.id, user.username, user.displayName, shardsCount );

            await interaction.reply({embeds: [embed]});

        } catch (err) {
            await errorLog(err);
        }
    }

}