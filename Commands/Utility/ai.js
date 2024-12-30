const {SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} = require(`discord.js`);
const {getLang} = require("../../Data/Lang");
const {groqAI, gemini} = require("../../Data/funcs/ai");
const path = require("path");
const fs = require("fs");
const {commandLog} = require("../../Data/funcs/commandLog");
const commandName = 'ai';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setNameLocalizations({ru: `ии`, pl: `ai`, uk: `іі`})
        .setDescription(`Send your request to the AI`)
        .setDescriptionLocalizations({
            ru: `Отправьте ваш запрос ИИ`,
            pl: `Wyślij swoje zapytanie do AI`,
            uk: `Надішліть ваш запит ШІ`
        })
        .addSubcommand(subcommand => subcommand
            .setName(`ask`)
            .setDescription(`Send your request for AI`)
            .setNameLocalizations({ru: `спросить`, pl: `zapytaj`, uk: `запитати`})
            .setDescriptionLocalizations({
                ru: `Отправьте ваш запрос для ИИ`,
                pl: `Wyślij swoje zapytanie do AI`,
                uk: `Надішліть ваш запит для ШІ`
            }).addStringOption(option => option
                .setName(`prompt`)
                .setNameLocalizations({ru: `запрос`, pl: `prompt`, uk: `запит`})
                .setDescription(`Your request`)
                .setDescriptionLocalizations({
                    ru: `Ваш запрос`,
                    pl: `Twój wniosek`,
                    uk: `Ваш запит`
                })
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`image`)
            .setDescription(`Send your request for image generation`)
            .setNameLocalizations({ru: `картинка`, pl: `obraz`, uk: `зображення`})
            .setDescriptionLocalizations({
                ru: `Отправьте ваш запрос на генерацию изображения`,
                pl: `Wyślij swoje zapytanie o generowanie obrazu`,
                uk: `Надішліть ваш запит на генерацію зображення`
            }).addStringOption(option => option
                .setName(`prompt`)
                .setNameLocalizations({ru: `запрос`, pl: `prompt`, uk: `запит`})
                .setDescription(`Your request`)
                .setDescriptionLocalizations({
                    ru: `Ваш запрос`,
                    pl: `Twój wniosek`,
                    uk: `Ваш запит`
                })
                .setRequired(true)
            ).addIntegerOption(option => option
                .setName(`width`)
                .setNameLocalizations({ru: `ширина`, pl: `szerokość`, uk: `ширина`})
                .setDescription(`Width of image`)
                .setDescriptionLocalizations({
                    ru: `Ширина изображения`,
                    pl: `Szerokość obrazu`,
                    uk: `Ширина зображення`
                })
                .setRequired(false)
            ).addIntegerOption(option => option
                .setName(`height`)
                .setNameLocalizations({ru: `высота`, pl: `wysokość`, uk: `висота`})
                .setDescription(`Height of image`)
                .setDescriptionLocalizations({
                    ru: `Высота изображения`,
                    pl: `Wysokość obrazu`,
                    uk: `Висота зображення`
                })
                .setRequired(false)
            )
        ),
    async execute(interaction) {
        if (!commandLog(commandName, interaction)) return;
        const lang = await getLang(interaction);
        const local = lang.ai;
        try {
            const subcommand = interaction.options.getSubcommand();
            const prompt = interaction.options.getString(`prompt`);

            if (subcommand === `ask`) {
                const result = await gemini(prompt);
                if (!result) return;
                if (result.length<1990) return await interaction.reply(result);
                const filePath = path.join(__dirname, 'temp.txt');
                await fs.promises.writeFile(filePath, result, 'utf8');
                const attachment = new AttachmentBuilder(filePath, 'message.txt');
                await interaction.reply({files: [attachment]})
                    .then(() => fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    }));

            } else if (subcommand === `image`) {

                const embedLoading = new EmbedBuilder()
                    .setTitle(`<a:loading:1295096250609172611>${local.loading}...`)
                    .setColor(`#ffc65c`);
                await interaction.reply({embeds: [embedLoading]});

                const result = await groqAI(prompt, "Если текст является безопасным отвечай true, если небезопасным или 18+ отвечай false");

                if (result == "true" || result == "True" || result == true) {
                    const randomChar = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    const readyPrompt = prompt.replace(/ /g, '%20')+randomChar;

                    const width = interaction.options.getInteger(`width`);
                    const height = interaction.options.getInteger(`height`);

                    const request = `https://image.pollinations.ai/prompt/${readyPrompt}?width=${width ? width : "512"}?height=${height ? height : "512"}&nologo=rokosbasilisk`;
                    const response = await fetch(request);

                    const embed = new EmbedBuilder()
                        .setTitle(local.generateImage)
                        .setDescription(`${local.prompt}: ${prompt}`)
                        .setColor(`#ffc65c`)
                        .setFooter({text: "☑️", iconURL: interaction.user.avatarURL({dynamic: true})})
                        .setImage(response.url);
                    await interaction.editReply({content: ``, embeds: [embed]});
                } else {
                    const embedError = new EmbedBuilder()
                        .setTitle(local.error)
                        .setColor(`#ff0000`);
                    await interaction.editReply({embeds: [embedError]});
                }
            }
        } catch (e) {
            console.error(e)
            const embedError = new EmbedBuilder()
                .setTitle(local.error)
                .setColor(`#ff0000`);
            await interaction.editReply({embeds: [embedError]});
        }
    }
}