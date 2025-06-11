const { default: axios } = require("axios");
const { Cheerio } = require("cheerio");
const Parser = require('rss-parser');
const { LanguageLearningJSON } = require("./kingereza-gpt");
const englishClubModel = require("../../bot/rtbot/database/englishswahili");
const { sendTGNotification } = require("./sendTGNotification");

const parser = new Parser();

const clubLinks = {
    idiom: "https://www.englishclub.com/ref/idiom-of-the-day.xml",
    phrase: "https://www.englishclub.com/ref/phrasal-verb-of-the-day.xml",
    slang: "https://www.englishclub.com/ref/slang-of-the-day.xml",
}

const getWordFromEnglishClub = async (type) => {
    try {
        const proxy_link = `http://api.scraperapi.com/?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(clubLinks[type])}`;
        const feed = await parser.parseURL(proxy_link);
        const { title, link, pubDate, content, isoDate } = feed.items[0];

        if (!title || !link || !pubDate || !content) {
            throw new Error("Failed to fetch data from English Club. Some fields are missing.");
        }
        return {
            type, term: title, pubDate, user_context: content, isoDate, link
        }
    } catch (error) {
        throw error
    }
}

const saveWordToDatabase = async (word_type) => {
    try {
        const englishClub = await getWordFromEnglishClub(word_type)
        const languageLearning = await LanguageLearningJSON(englishClub.term, englishClub.type, englishClub.user_context)

        // save data to the database if not already present
        const existingEntry = await englishClubModel.findOne({ term: languageLearning.term, type: languageLearning.type, link: englishClub.link });
        if (existingEntry) {
            return await sendTGNotification(`❗️ Entry already exists: ${languageLearning.term} (${languageLearning.type})`);
        }
        const newEntry = new englishClubModel({
            type: languageLearning.type,
            term: languageLearning.term,
            user_context: languageLearning.user_context,
            meaning: languageLearning.meaning,
            examples: languageLearning.examples,
            challenge: languageLearning.challenge,
            pubDate: englishClub.isoDate,
            link: englishClub.link
        });
        await newEntry.save();
        await sendTGNotification(`✅ New entry saved: ${languageLearning.term} (${languageLearning.type})`);
        return await axios.post(`http://${process.env.VPS_IP}:3100/post/english`, {
            type: languageLearning.type,
            term: languageLearning.term,
            meaning: languageLearning.meaning,
            examples: languageLearning.examples,
            challenge: languageLearning.challenge
        })
    } catch (error) {
        console.log(error.message, error)
        return await sendTGNotification(`❗️ Error saving entry: ${error.message}`);
    }
}

module.exports = {
    getWordFromEnglishClub,
    saveWordToDatabase
};