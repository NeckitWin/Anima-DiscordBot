import {sqlPost} from "./db.ts";

const updateUsedCommandsCount = async (data) => {
    const sql = `UPDATE stats SET commands = commands + ?, servers = ?, users = ?`;
    try {
        await sqlPost(sql, [data.usedCommands, data.servers, data.users]);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};


export {updateUsedCommandsCount};