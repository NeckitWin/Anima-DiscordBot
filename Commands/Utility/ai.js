const {SlashCommandBuilder, EmbedBuilder} = require(`discord.js`);
const {getLang} = require("../../Data/Lang");
const {getCooldown} = require("../../Data/funcs/cooldown");
const config = require("../../Data/config.json");
const {GoogleGenerativeAI} = require("@google/generative-ai");


process.env.GOOGLE_API_KEY = config.geminiApiKey;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ai`)
        .setNameLocalizations({ru: `ии`, pl: `ai`, uk: `іі`})
        .setDescription(`Send your request to the AI`)
        .setDescriptionLocalizations({
            ru: `Отправьте ваш запрос ИИ`,
            pl: `Wyślij swoje zapytanie do AI`,
            uk: `Надішліть ваш запит ШІ`
        })
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
        const lang = await getLang(interaction);
        const local = lang.ai;
        try {
            const subcommand = interaction.options.getSubcommand();
            const prompt = interaction.options.getString(`prompt`);

            if (subcommand === `image`) {
                // if (await getCooldown('ai', interaction, 600)) return; // cooldown

                const embedLoading = new EmbedBuilder()
                    .setTitle(`<a:loading:1295096250609172611>${local.loading}...`)
                    .setColor(`#ffc65c`);
                await interaction.reply({embeds: [embedLoading]});

                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    systemInstruction: "Remove 18+ content from the provided text. Enhance the text for image generation and ensure each request is unique. Your response should be no more than 100 characters!",
                });

                const generate = await model.generateContent(prompt);
                const result = generate.response.text();
                const readyPrompt = result.replace(/ /g, '%20');

                const width = interaction.options.getInteger(`width`);
                const height = interaction.options.getInteger(`height`);

                const request = `https://image.pollinations.ai/prompt/${readyPrompt}?width=${width ? width : "512"}?height=${height ? height : "512"}&nologo=rokosbasilisk`;
                const response = await fetch(request);

                const embed = new EmbedBuilder()
                    .setTitle(local.generateImage)
                    .setDescription(`${local.prompt}: ${prompt}`)
                    .setColor(`#ffc65c`)
                    .setImage(response.url);
                await interaction.editReply({content: ``, embeds: [embed]});
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