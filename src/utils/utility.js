const getTypeChannel = (type) => {
    switch (type) {
        case 0:
            return `text`;
        case 2:
            return `voice`;
        case 15:
            return `forum`;
        case 4:
            return `category`;
        case 5:
            return `news`;
        case 13:
            return `stage`;
        default:
            return `unknown`;
    }
};
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};
const getStickerFormat = (format) => {
    switch (format) {
        case 1:
            return `png`;
        case 2:
            return `png`;
        case 3:
            return `webp`;
        case 4:
            return `gif`;
    }
};
const serverProtection = (number) => {
    switch (number) {
        case 0:
            return 'none';
        case 1:
            return 'low';
        case 2:
            return 'medium';
        case 3:
            return 'high';
        case 4:
            return 'veryhigh';
    }
};
const getActivityType = (type) => {
    switch (type) {
        case 0:
            return 'play';
        case 1:
            return 'stream';
        case 2:
            return 'listen';
        case 3:
            return 'watch';
        case 4:
            return 'custom';
        case 5:
            return 'compete';
        default:
            return false;
    }
};
const getStatusEmoji = (status) => {
    switch (status) {
        case 'online':
            return '<:online:1294745413085302925>';
        case 'idle':
            return '<:idle:1294745429451473048>';
        case 'dnd':
            return '<:dnd:1294745439567876250>';
        case 'offline':
            return '<:invisible:1294745501941501952>';
        default:
            return '<:invisible:1294745501941501952>';
    }
};
const getBadgeEmoji = (badge) => {
    switch (badge) {
        case `HypeSquadOnlineHouse1`:
            return `<:badge_bravery:1295007106813919324>`;
        case `HypeSquadOnlineHouse2`:
            return `<:badge_brillance:1295007063281242173>`;
        case `HypeSquadOnlineHouse3`:
            return `<:badge_balance:1295007143807811614>`;
        case `ActiveDeveloper`:
            return `<:badge_active:1295006989025542205>`;
    }
};
export { formatDate, getTypeChannel, getStickerFormat, serverProtection, getActivityType, getStatusEmoji, getBadgeEmoji };
