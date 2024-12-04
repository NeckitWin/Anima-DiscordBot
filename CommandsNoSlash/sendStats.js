const {sdcKEY} = require('../Data/config.json');
const SDC = require("@megavasiliy007/sdc-api");

module.exports = {
    name: 'send_stats',
    description: 'Send stats for sdc',
    execute(message) {
        if (message.author.id != '429562004399980546') return;
        try {
            const sdc = new SDC(sdcKEY);
            sdc.setAutoPost(message.client);
        } catch (err) {
            console.error(err);
        }
    }
}