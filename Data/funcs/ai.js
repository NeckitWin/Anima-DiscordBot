const Groq = require("groq-sdk");
const {groqKey} = require(`../config.json`);

const groqAI = async (prompt) => {
    try {
        process.env.GROQ_API_KEY = groqKey;
        const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
        const groqAnswer = await groq.chat.completions.create({
            messages: [
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

module.exports = {groqAI}