const {Events, EmbedBuilder} = require(`discord.js`);
const {getLang} = require("../Data/Lang");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId !== `postModal`) return;
            const lang = await getLang(interaction);
            const local = lang.post;
            const data = interaction.fields.components;
            const title = data[0].components[0].value;
            const description = data[1].components[0].value;
            const color = data[2].components[0].value;
            const image = data[3].components[0].value;
            const authorID = data[4].components[0].value;
            const mebmer = interaction.guild.members.cache.get(authorID);

            let errorMessage;
            if (!title && !description && !image) errorMessage = local.errorContent;
            if (color && !/^#[0-9A-F]{6}$/i.test(color)) errorMessage = local.errorColor;
            if (authorID && !mebmer) errorMessage = local.errorAuthor;
            if (image && !/^https?:\/\/.+\..+/i.test(image)) errorMessage = local.errorImage;
            if (errorMessage) {
                const embed = new EmbedBuilder()
                    .setColor(`#d80000`)
                    .setTitle(errorMessage);
                return await interaction.reply({embeds: [embed], ephemeral: true});
            }

            const embed = new EmbedBuilder()

            if (title) embed.setTitle(title);
            if (description) embed.setDescription(description);
            if (color) embed.setColor(color);
            if (image) embed.setImage(image);
            if (authorID && mebmer) embed.setAuthor({
                name: mebmer.user.displayName,
                iconURL: mebmer.user.displayAvatarURL({dynamic: true})
            });

            await interaction.channel.send({embeds: [embed]});
            await interaction.reply({content: lang.post.complete, ephemeral: true});

        } catch (err) {
            console.error(err);
        }
    }
}