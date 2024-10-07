const {Events} = require(`discord.js`);
const path = require("node:path");
const fs = require("node:fs");
const lang = require("../Data/Lang");
const {getLang} = require("../Data/Lang");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== `modalGreeting`) return;
        const serverID = interaction.guild.id;

        const lang = await getLang(interaction);
        const local = lang.greeting;

        const obj = interaction.fields.fields.map(el=>el.value);

        const newData = {
            server: serverID,
            title: obj[0],
            content: obj[1],
            picture: obj[2],
            channel: obj[3]
        }

        const pathFile = path.join(__dirname, "../Data/jsons/greeting.json");
        const data = await fs.promises.readFile(pathFile, 'utf8');
        let jsonData = JSON.parse(data);
        const thisServer = jsonData.find(el=>el.server===serverID);
        if (thisServer) {
            jsonData = jsonData.filter(el=>el.server!==serverID)
        }
        jsonData.push(newData);
        const newJson = JSON.stringify(jsonData, null, 2);
        await fs.promises.writeFile(pathFile, newJson);
        await interaction.reply({content: `${local.success} <#${newData.channel}>`, ephemeral: true})
    }
}