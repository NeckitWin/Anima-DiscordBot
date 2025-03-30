import { AttachmentBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

export default {
    name: 'code',
    description: 'give files',
    async execute(message) {
        if (message.author.id !== '429562004399980546') return;

        if (!message.channel.permissionsFor(message.client.user).has("SendMessages")) return;

        let args = message.content.slice(5).trim().split(/ +/);
        let name = args[0];

        const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
        const directoryPath = path.join(__dirname, '../');

        async function getFiles(dir) {
            const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
            const files = await Promise.all(dirents.map((dirent) => {
                const res = path.resolve(dir, dirent.name);

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
                        const attachment = new AttachmentBuilder(file);

                        message.channel.send({ files: [attachment] })
                            .catch(err => console.error(err));
                    }
                });
            })
            .catch(e => console.error(e));
    }
}
