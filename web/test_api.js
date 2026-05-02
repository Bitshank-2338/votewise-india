const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

async function testChat() {
  try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    const apiKeyLine = envFile.split("\n").find(line => line.startsWith("GEMINI_API_KEY="));
    const apiKey = apiKeyLine.split("=")[1].trim();

    const ai = new GoogleGenAI({ apiKey });
    const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-flash-latest", "gemini-1.5-flash"];

    for (const model of models) {
      console.log(`Testing model: ${model}...`);
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: "Respond with 'WORKING'",
        });
        console.log(`SUCCESS for ${model}: ` + response.text);
        return; // Stop on first success
      } catch (err) {
        console.error(`ERROR for ${model}:`, err.message);
      }
    }
  } catch (error) {
    console.error("FATAL ERROR:", error.message);
  }
}

testChat();
