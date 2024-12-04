const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`);
const {updateUserWallet} = require("../../Data/funcs/dbUser");
const {getCooldown} = require("../../Data/funcs/cooldown");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`daily`)
        .setDescription(`Get your daily reward`)
        .setNameLocalizations({ru: `ежедневнка`, pl: `dobówka`, uk: `щоденка`})
        .setDescriptionLocalizations({
            ru: `Получить ежедневное вознаграждение`,
            pl: `Dostać codzienną nagrodę`,
            uk: `Отримати щоденне винагородження`
        }),
    async execute(interaction) {
        if (await getCooldown('daily', interaction, 60*60*24)) return;
        // return await interaction.reply(`Команда в разработке`);
        const minSalary = 1;
        const maxSalary = 10;
        const gifLootBox = `https://media1.tenor.com/m/XUZtiluznZkAAAAd/kamiru-motivation.gif`;
        const userID = interaction.user.id;
        const serverID = interaction.guild.id;
        const salary = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;
        const embedLoading = new EmbedBuilder()
            .setTitle(`Ежедневное вознаграждение`)
            .setDescription(`<a:loading:1295096250609172611> Открытие ежедневного вознаграждения...`)
            .setImage(gifLootBox);

        const embedReward = new EmbedBuilder()
            .setTitle(`Ежедневное вознаграждение`)
            .setDescription(`Вы получили ${salary} шардов <:shard:1296969847690760234>`)
            .setColor(`#00ff00`);


        await interaction.reply({embeds: [embedLoading]});
        setTimeout(async() => {
            await updateUserWallet(userID, serverID, 'shards', salary);
            await interaction.editReply({embeds: [embedReward]});
        }, 3000);
    }
}