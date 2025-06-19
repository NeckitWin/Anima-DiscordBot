import { EmbedBuilder, Events } from "discord.js";
import errorLog from "../utils/errorLog.ts";
import { addShards, removeShards } from "../repo/shardsRepository.ts";
import { getLang } from "../utils/lang.ts";
import { emoji } from "../components/emoji.ts";
const doorsData = [
    { id: 1, result: "win", gif: "https://usagif.com/wp-content/uploads/gify/suzume-s-locking-up-suzume-enters-magical-door-usagif.gif" },
    { id: 2, result: "none", gif: "https://64.media.tumblr.com/30e87887889bda25171e7131b33aa78e/a0a816c22620d3ff-59/s540x810/a24f1095e2fda3edd5513f3c08c9ed55fa62093a.gif" },
    { id: 3, result: "lose", gif: "https://c.tenor.com/bZ-aCJUpR8gAAAAd/tenor.gif" }
];
export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (!interaction.isButton())
                return;
            if (!interaction.customId.startsWith('magicDoor'))
                return;
            const lang = await getLang(interaction);
            const local = lang.doors;
            if (interaction.user.id !== interaction.message.interaction.user.id) {
                return interaction.reply({
                    content: lang.error.notyourcommand,
                    ephemeral: true
                });
            }
            const randomDoor = Math.floor(Math.random() * doorsData.length);
            const door = doorsData[randomDoor];
            const shardCount = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
            const embed = new EmbedBuilder()
                .setTitle(local.title)
                .setImage(door.gif);
            switch (door.result) {
                case "win":
                    await addShards(interaction.user.id, interaction.guild.id, interaction.user.username, interaction.user.displayName, shardCount);
                    embed.setColor('#00ff94');
                    embed.setDescription(`${local.win} ${shardCount + emoji.shard}`);
                    break;
                case "none":
                    embed.setColor('#ffe87b');
                    embed.setDescription(local.none);
                    break;
                case "lose":
                    await removeShards(interaction.user.id, interaction.guild.id, interaction.user.username, interaction.user.displayName, randomDoor + 1);
                    embed.setColor('#ff004d');
                    embed.setDescription(`${local.lose} ${shardCount + emoji.shard}`);
                    break;
            }
            await interaction.message.edit({
                embeds: [embed],
                components: []
            });
        }
        catch (err) {
            await errorLog(err);
        }
    }
};
