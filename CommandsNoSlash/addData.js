const {EmbedBuilder} = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: 'add_data',
    description: 'Owner command',
    async execute(message) {
        const messageArray = message.content.split(' ');
        const jsonFile = messageArray[1];
        const target = messageArray[2];
        const newData = messageArray[3];

        const pathFile = path.join(__dirname, `../Data/jsons/${jsonFile}.json`);

        fs.readFile(pathFile, 'utf8',(err, data)=>{
            if (err) return console.error(err);
            let replyMessage;

            try {
                const jsonData = JSON.parse(data);

                if (jsonData[target]) {
                    jsonData[target].push(newData);
                    replyMessage = `success of adding data`;
                } else {
                    replyMessage = `json doesn't has this target`;
                }

                fs.writeFile(pathFile, JSON.stringify(jsonData, null, 2), err=>{
                    if (err) {
                        console.error(err);
                        replyMessage=`json write has error`;
                    }
                })

                message.reply(replyMessage);
            } catch (e) {
                console.error(e)
            }
        })
    }
}