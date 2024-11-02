const Groq = require("groq-sdk");
const {groqKey, geminiApiKey} = require(`../config.json`);
const { GoogleGenerativeAI } = require("@google/generative-ai");

const groqAI = async (prompt, systemSettings = `Anima Discord Bot`) => {
    try {
        process.env.GROQ_API_KEY = groqKey;
        const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
        const groqAnswer = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemSettings,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-8b-8192",
        });

        return groqAnswer.choices[0]?.message?.content || "";
    } catch (error) {
        console.error(error);
    }
}

const gemini = async (prompt) => {
    process.env.GEMINI_API_KEY = geminiApiKey;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
    const result = await model.generateContent([prompt]);
    return result.response.text();
}

module.exports = {groqAI, gemini}