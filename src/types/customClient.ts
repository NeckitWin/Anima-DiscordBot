import { Client, Collection } from 'discord.js';
import {Command} from "./command.ts";

export interface CustomClient extends Client {
    commands: Collection<string, Command>;
    cooldowns: Collection<string, number>;
}