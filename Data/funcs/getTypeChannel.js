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
}

module.exports = {getTypeChannel};