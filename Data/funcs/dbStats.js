const {sqlPost} = require(`./db`);

const updateUsedCommandsCount = async (count) => {
    const sql = `UPDATE stats SET usedCommandsCount = usedCommandsCount + ?`;
    try {
        await sqlPost(sql, [count]);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};


module.exports = {updateUsedCommandsCount};