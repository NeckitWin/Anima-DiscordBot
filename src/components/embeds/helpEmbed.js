import { EmbedBuilder } from "discord.js";
export const helpEmbed = (interaction, lang) => {
    const local = lang.menuhelp;
    const commands = {
        info: '</help:1285287069676994605>, </bot:1285287069676994604>, </user:1274053573700878358>, </leaders:1287176496791945268>, </avatar-banner:1285287069676994603>, </server:1285287069676994607>, </role:1285287069676994606>',
        admin: `</language:1292081237837611079>, </autoroles:1329204198402953417>, </welcome set:1329204198402953419>, </welcome preview:1329204198402953419>, </welcome remove:1329204198402953419>, </logs set:1299470943638519890>, </logs remove:1299470943638519890>`,
        moder: '</clear:1285287069676994609>, </post:1302340870892163093>',
        util: '</calc:1285287069756690488>, </translate:1285287069756690490>, </weather:1285287069756690491>',
        games: '</anime:1294302199869997197>, `+aura`, `-aura`',
        fun: '</ai-animal:1365688051745165423>, </rp:1299513629934223493>, </marry:1302061890201063454>, </nsfw:1293672483869949973>, </ship:1295137310584864868>, </ben:1292452492986155051>, </ball:1300172412628762656>'
    };
    return new EmbedBuilder()
        .setTitle(local.placeholder)
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .addFields([
        {
            name: `📚・${local.info.label}`,
            value: commands.info,
            inline: false
        },
        {
            name: `👑・${local.admin.label}`,
            value: commands.admin,
            inline: false
        },
        {
            name: `👮‍♂️・${local.moder.label}`,
            value: commands.moder,
            inline: false
        },
        {
            name: `🔧・${local.util.label}`,
            value: commands.util,
            inline: false
        },
        {
            name: `🎮・${local.games.label}`,
            value: commands.games,
            inline: false
        },
        {
            name: `🎉・${local.fun.label}`,
            value: commands.fun,
            inline: false
        }
    ])
        .setAuthor({
        name: lang.request + interaction.user.displayName,
        icon_url: interaction.user.displayAvatarURL(),
    });
};
