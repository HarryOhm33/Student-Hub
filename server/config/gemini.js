// config/gemini.js

const { GoogleGenAI } = require("@google/genai");

let ai = null;

// Lazy initialize Gemini only when needed
function getAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return ai;
}

/**
 * Send prompt + JSON data to Gemini
 */
const askGemini = async (prompt, jsonData) => {
  const client = getAI(); // ← initialize here only

  const input = `${prompt}\n\nStudent Data:\n${JSON.stringify(
    jsonData,
    null,
    2,
  )}`;

  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: input,
  });

  return response.text;
};

module.exports = { askGemini };
