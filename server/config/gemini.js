// config/gemini.js
const { GoogleGenAI } = require("@google/genai");

// API key is automatically picked from process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

/**
 * Send prompt + JSON data to Gemini
 * @param {string} prompt - The prompt to guide Gemini
 * @param {object} jsonData - Student academic data
 */
const askGemini = async (prompt, jsonData) => {
  const input = `${prompt}\n\nStudent Data:\n${JSON.stringify(
    jsonData,
    null,
    2,
  )}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: input,
  });

  return response.text; // plain text output
};

module.exports = { askGemini };
