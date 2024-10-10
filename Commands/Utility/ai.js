const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} = require("@google/generative-ai");
const {SlashCommandBuilder} = require(`discord.js`);
// const Groq = require("groq-sdk");
// const config = require("../../Data/config.json");


// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// async function getGroq(prompt) {
//     return groq.chat.completions.create({
//         messages: [
//             {
//                 role: "user",
//                 content: prompt,
//             },
//         ],
//         model: "llama3-8b-8192",
//     });
// }
//
// async function getGemini(prompt) {
//     const model = genAI.getGenerativeModel({
//         model: "gemini-1.5-flash",
//         systemInstruction: "You are a Discord Bot (Anima girl character). Your name is Anima. You are a helpful assistant.",
//         safetySettings: [
//             {category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE},
//             {category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE},
//             {category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE},
//             {category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE}
//         ]
//     });
//
//     const generate = await model.generateContent(
//         message.attachments.size > 0 ? [prompt, {
//             inlineData: {
//                 data: buffer.toString("base64"),
//                 mimeType: message.attachments.first().contentType
//             }
//         }] : prompt
//     );
//     return generate.response.text();
// }

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ai`)
        .setDescription(`Use AI to generate answers for your requests`)
        .setDescriptionLocalizations({
            ru: `Используйте ИИ для генерации ответов на ваши запросы`,
            pl: `Użyj AI do generowania odpowiedzi na twoje żądania`,
            uk: `Використовуйте ШІ для генерації відповідей на ваші запити`
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName(`gemini`)
                .setDescription(`Use gemini-1.5-flash model`)
                .setDescriptionLocalizations({
                    ru: `Используйте модель gemini-1.5-flash`,
                    pl: `Użyj modelu gemini-1.5-flash`,
                    uk: `Використовуйте модель gemini-1.5-flash`
                })
                .addStringOption(option =>
                    option
                        .setName(`text`)
                        .setDescription(`Text to generate`)
                        .setDescriptionLocalizations({
                            ru: `Текст для генерации`,
                            pl: `Tekst do wygenerowania`,
                            uk: `Текст для генерації`
                        })
                        .setRequired(true)
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName(`groq`)
                .setDescription(`Use llama3-8b-8192 model`)
                .setDescriptionLocalizations({
                    ru: `Используйте модель llama3-8b-8192`,
                    pl: `Użyj modelu llama3-8b-8192`,
                    uk: `Використовуйте модель llama3-8b-8192`
                })
                .addStringOption(option =>
                    option
                        .setName(`text`)
                        .setDescription(`Text to generate`)
                        .setDescriptionLocalizations({
                            ru: `Текст для генерации`,
                            pl: `Tekst do wygenerowania`,
                            uk: `Текст для генерації`
                        })
                        .setRequired(true)
                )),
    async execute(interaction) {

    }
}