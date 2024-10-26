module.exports = {
    name: 'check_all',
    description: 'Owner command',
    async execute(message) {
        try {
            console.log(message);
        } catch (e) {
            console.error(e)
        }
    }
}