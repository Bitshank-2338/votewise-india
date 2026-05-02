const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

async function testChat() {
  try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    const apiKeyLine = envFile.split("\n").find(line => line.startsWith("GEMINI_API_KEY="));
    const apiKey = apiKeyLine.split("=")[1].trim();

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: "Respond with 'WORKING' if you receive this.",
    });
    console.log("SUCCESS: " + response.text);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

testChat();
