// config/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Choose the right model (text-only or multimodal)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Send prompt + JSON data to Gemini
 * @param {string} prompt - The prompt to guide Gemini
 * @param {object} jsonData - Student academic data
 */
const askGemini = async (prompt, jsonData) => {
  const input = `${prompt}\n\nStudent Data:\n${JSON.stringify(
    jsonData,
    null,
    2
  )}`;

  const result = await model.generateContent(input);
  return result.response.text(); // return plain text
};

module.exports = { askGemini };
