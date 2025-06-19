import { getLang } from "./lang.ts";
const timeout = new Map();
const setCooldown = async (commandEvent, message, time) => {
    const userID = message.author?.id ?? message.user.id;
    const lang = await getLang(message);
    const local = lang.error;
    const now = Date.now();
    const minutes = time * 1000 * 60;
    const key = `${userID}-${message.guild.id}-${commandEvent}`;
    if (timeout.has(key)) {
        const expirationTime = timeout.get(key) + minutes;
        await message.reply({ content: `${local.wait} <t:${Math.floor(expirationTime / 1000)}:R>`, ephemeral: true });
        return false;
    }
    timeout.set(key, now);
    setTimeout(() => {
        timeout.delete(key);
    }, minutes);
    return true;
};
export { setCooldown };
