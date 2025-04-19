// generate work
import { SlashCommandBuilder } from 'discord.js';
import errorLog from "../../Utils/errorLog.js";
import {getLang} from "../../Utils/lang.js";

export  default {
    data: new SlashCommandBuilder()
        .setName('work')
        .setNameLocalizations({ ru: 'работать', pl: 'pracować', uk: 'працювати' })
        .setDescription('Work for shards')
        .setDescriptionLocalizations({
            ru: 'Работать за осколки',
            pl: 'Pracować za odłamki',
            uk: 'Працювати за осколки',
        }),
    async execute(interaction) {
        try {
            const lang = await getLang(interaction);
            const minShards = 1;
            const maxShards = 10;
            const shardsCount = Math.floor(Math.random() * (maxShards - minShards + 1)) + minShards;


        } catch (err) {
            await errorLog(err);
        }
    }

}