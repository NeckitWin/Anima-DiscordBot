import {sqlPost} from "./db.js";

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


export {updateUsedCommandsCount};