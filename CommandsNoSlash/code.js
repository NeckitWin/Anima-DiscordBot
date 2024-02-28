const {CommandInteraction, AttachmentBuilder} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
        name: 'code',
        description: 'give command',
        async execute(message) {
            if(message.author.id !== '429562004399980546') return;

            let args = message.content.slice(5).trim().split(/ +/);
            let name = args[0];

            const directoryPath = path.join(__dirname, '../');

            async function getFiles(dir) {
                const dirents = await fs.promises.readdir(dir, {withFileTypes: true});
                const files = await Promise.all(dirents.map((dirent) => {
                    const res = path.resolve(dir, dirent.name);
                    // Если текущая папка - это node_modules, пропустить ее
                    if (dirent.isDirectory() && dirent.name === 'node_modules') {
                        return [];
                    }
                    return dirent.isDirectory() ? getFiles(res) : res;
                }));
                return Array.prototype.concat(...files);
            }

            getFiles(directoryPath)
                .then(files => {
                    files.forEach(file => {
                        if (path.basename(file) === name + '.js') {
                            fs.readFile(file, 'utf8', (err, data) => {
                                if (err) throw err;
                                const chunks = data.match(/[\s\S]{1,1990}/g) || [];
                                chunks.forEach(chunk => {
                                    message.channel.send("```js\n" + chunk + "```");
                                });
                            });
                        }
                    });
                })
                .catch(e => console.error(e));
        }
}