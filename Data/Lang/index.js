const en = require('../../Data/Lang/en.json');
const ru = require('../../Data/Lang/ru.json');
const uk = require('../../Data/Lang/uk.json');
const pl = require('../../Data/Lang/pl.json');
const {getServer} = require("../funcs/dbServer");
const index = {ru, en, uk, pl};

const getLang = async (interaction) => {
    try {
        const guildId = interaction.guild.id;
        const guildName = interaction.guild.name;

        const serverData = await getServer(guildId, guildName);
        return index[serverData.lang];
    } catch (error) {
        console.error(error);
        return index[`en`];
    }

}

module.exports = {getLang};