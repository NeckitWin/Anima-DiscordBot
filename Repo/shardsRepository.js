import {sqlPost} from "./db.js";
import {getUserServer} from "./userRepository.js";

const updateShards = async (userId, serverId, shardsCount) => {
    const ifUserHasWallet = await getUserServer(userId, serverId);
    const query = `UPDATE wallet SET shards = shards + ? WHERE userID = ? AND serverID = ?`;
    await sqlPost(query, [shardsCount, userId, serverId]);
}