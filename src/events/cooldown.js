import { Events, Collection, EmbedBuilder } from 'discord.js';
import { getLang } from '../utils/lang.ts';
import { commandLog } from '../utils/commandLog.ts';
import errorLog from "../utils/errorLog.ts";
export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (!interaction.isChatInputCommand())
                return;
            const { cooldowns } = interaction.client;
            if (!await commandLog(interaction.commandName, interaction))
                return;
            const command = interaction.client.commands.get(interaction.commandName);
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }
            const lang = await getLang(interaction);
            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    const embedCooldown = new EmbedBuilder()
                        .setColor('#00ffc4')
                        .setDescription(`${lang.cooldown.wait} <t:${expiredTimestamp}:R> ${lang.cooldown.again} \`${command.data.name}\`.`);
                    return interaction.reply({
                        embeds: [embedCooldown],
                        ephemeral: true
                    });
                }
            }
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            try {
                await command.execute(interaction);
            }
            catch (error) {
                await errorLog(error);
                const embedError = new EmbedBuilder()
                    .setColor('#bc0000')
                    .setTitle('Error')
                    .setDescription(`${lang.error.unknown}: https://discord.gg/d8kCF4c3t5`);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        embeds: [embedError],
                        ephemeral: true
                    });
                }
                else {
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({
                        embeds: [embedError]
                    });
                }
            }
        }
        catch (err) {
            await errorLog(err);
        }
    }
};
