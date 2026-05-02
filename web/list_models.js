const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

async function listModels() {
  try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    const apiKeyLine = envFile.split("\n").find(line => line.startsWith("GEMINI_API_KEY="));
    const apiKey = apiKeyLine.split("=")[1].trim();

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.list();
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
