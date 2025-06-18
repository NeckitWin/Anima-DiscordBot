import type { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
}
