import { Events } from 'discord.js';
import { getLang } from '../Data/Lang/index.js';
import { updateGreet } from '../Features/dbGreet.js';
import { commandLog } from '../Features/commandLog.js';

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId !== `modalGreeting`) return;
            if(!commandLog("modalGreetHandle", interaction, 1)) return;
            const serverID = interaction.guild.id;

            const lang = await getLang(interaction);
            const local = lang.greeting;

            const obj = interaction.fields.fields.map(el => el.value);

            const newData = {
                serverId: serverID,
                title: obj[0],
                content: obj[1],
                picture: obj[2],
                channelId: BigInt(obj[3])
            }

            await updateGreet(newData.serverId, newData.title, newData.content, newData.picture, newData.channelId);
            await interaction.reply({content: `${local.success} <#${newData.channelId}>`, ephemeral: true})
        } catch (err) {
            console.error(err);
        }
    }
}