import { ShardingManager } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const manager = new ShardingManager('./bot.ts', { token: process.env.TOKEN });
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();
