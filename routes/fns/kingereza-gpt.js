const OpenAI = require('openai');
const { zodTextFormat } = require('openai/helpers/zod')
const { z } = require('zod')

const openai = new OpenAI({
    apiKey: process.env.openAIKey,
});


//schema
const LanguageLearningContent = z.object({
    type: z.enum(["idiom", "phrase", "saying", "slang", "word"]),
    term: z.string(),
    user_context: z.string(),
    meaning: z.object({
        english: z.string(),
        swahili: z.string(),
    }),
    examples: z.array(
        z.object({
            en: z.string(),
            sw: z.string(),
        })
    ),
    challenge: z.object({
        text: z.string(),
        type: z.enum(["sentence-creation", "translation", "fill-in-the-blank"]),
    }),
});

const expected_output_example = {
    "type": "idiom",
    "term": "run-of-the-mill",
    "user_context": "Something is run-of-the-mill if it is ordinary and nothing special.",
    "meaning": {
        "english": "Ordinary, average, or not special in any way.",
        "swahili": "Ya kawaida tu / Isiyo ya kipekee"
    },
    "examples": [
        {
            "en": "The movie was okay, but it was just another run-of-the-mill romantic comedy.",
            "sw": "Filamu ilikuwa sawa tu, lakini ilikuwa tu tamthilia ya kimapenzi ya kawaida."
        },
        {
            "en": "She didn’t want a run-of-the-mill job — she wanted something exciting and meaningful.",
            "sw": "Hakutaka kazi ya kawaida — alitaka kitu cha kusisimua na chenye maana."
        },
        {
            "en": "Most of the restaurants in that area are pretty run-of-the-mill.",
            "sw": "Migahawa mingi katika eneo hilo ni ya kawaida tu."
        }
    ],
    "challenge": {
        "text": "Tunga sentensi yako ukitumia *run-of-the-mill*",
        "type": "sentence-creation"
    }
}



const LanguageLearningJSON = async (term, term_type, user_context) => {
    try {
        const response = await openai.responses.parse({
            model: "gpt-4.1",
            input: [
                {
                    role: "system",
                    content:
                        `You are a bilingual assistant helping Swahili speakers learn English. You will be given an English term (idiom, word, slang, phrase, or saying), its type, and and a user-provided context explaining what the term means and return a JSON structure in both English and Swahili, three examples, and a simple challenge for the learner. Use the user_context to understand what the user *intends* the term to mean, but write a clearer and more complete version of the meaning in your own words. Look at the example below:\n\n${expected_output_example}`,
                },
                {
                    role: "user",
                    content: `Term: ${term} \nType: ${term_type} \nUser context: ${user_context}`,
                },
            ],
            temperature: 0.3,
            text: {
                format: zodTextFormat(LanguageLearningContent, "language_learning_content"),
            },
        });

        const language_learning_content = response.output_parsed;
        return language_learning_content
    } catch (error) {
        throw error
    }
}


module.exports = {
    LanguageLearningJSON
}