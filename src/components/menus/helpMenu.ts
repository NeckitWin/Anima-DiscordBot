import {StringSelectMenuBuilder} from "discord.js";


export const menuHelp = (local: any) => {
 return new StringSelectMenuBuilder()
     .setCustomId('menuHelp')
     .setPlaceholder(local.placeholder)
     .addOptions([
         {
             label: `${local.info.label}`,
             description: `${local.info.description}`,
             value: 'info',
             emoji: '📚',
         },
         {
             label: `${local.admin.label}`,
             description: `${local.admin.description}`,
             value: 'admin',
             emoji: '👑',
         },
         {
             label: `${local.moder.label}`,
             description: `${local.moder.description}`,
             value: 'moder',
             emoji: '👮‍♂️',
         },
         {
             label: `${local.economy.label}`,
             description: `${local.economy.description}`,
             value: 'economy',
             emoji: '🪙',
         },
         {
             label: `${local.util.label}`,
             description: `${local.util.description}`,
             value: 'utils',
             emoji: '🔧',
         },
         {
             label: `${local.games.label}`,
             description: `${local.games.description}`,
             value: 'games',
             emoji: '🎮',
         },
         {
             label: `${local.fun.label}`,
             description: `${local.fun.description}`,
             value: 'fun',
             emoji: '🎉',
         },
     ]);
}