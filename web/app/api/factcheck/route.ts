import { GoogleGenAI } from "@google/genai";
import { rateLimit, getClientIP } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/sanitize";

export const runtime = "edge";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function POST(req: Request) {
  try {
    const ip = getClientIP(req.headers);
    const rl = rateLimit(ip, 5, 60000); // Strict limit: 5 fact checks per minute
    if (rl.limited) {
      return Response.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { claim } = await req.json();
    const cleanClaim = sanitizeInput(claim);

    if (!cleanClaim) {
      return Response.json({ error: "Empty claim" }, { status: 400 });
    }

    const prompt = `You are the VoteWise India Fact-Checking AI. 
Evaluate the following political claim, news headline, or WhatsApp forward related to Indian politics/elections.
Return ONLY a strictly formatted JSON object with no markdown backticks, following this structure:
{
  "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIABLE",
  "confidence": number between 0 and 100,
  "explanation": "A concise, objective 2-sentence explanation of why it is true, false, or misleading based on constitutional facts or ECI guidelines.",
  "source": "A plausible primary source to check (e.g., 'Election Commission of India Website', 'PIB Fact Check')"
}

Claim to evaluate: "${cleanClaim}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1, // Low temperature for factual responses
      },
    });

    const rawText = response.text || "{}";
    
    // Safely extract JSON if it's wrapped in markdown
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid format from AI");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return Response.json(parsed);

  } catch (error) {
    console.error("FactCheck API Error:", error);
    return Response.json(
      { error: "Failed to analyze claim. Please try again." },
      { status: 500 }
    );
  }
}
