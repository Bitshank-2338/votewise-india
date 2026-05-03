import { NextRequest } from "next/server";
import { rateLimit, getClientIP } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/sanitize";
import { translateText } from "@/lib/google/translate";

/**
 * POST /api/translate
 * Body: { text: string, target: string, source?: string }
 * Wraps Google Cloud Translation API v2. Used for live translation of news
 * headlines and AI chat responses when the locale-bundle string is missing.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIP(req.headers);
  const { limited, resetIn } = rateLimit(`tr:${ip}`, 30, 60_000);
  if (limited) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) },
      }
    );
  }

  let body: { text?: string; target?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = sanitizeInput(body.text || "").slice(0, 5000);
  const target = (body.target || "").replace(/[^a-z-]/gi, "").slice(0, 10);
  const source = body.source
    ? body.source.replace(/[^a-z-]/gi, "").slice(0, 10)
    : undefined;

  if (!text || !target) {
    return Response.json(
      { error: "text and target are required" },
      { status: 400 }
    );
  }

  const result = await translateText(text, target, source);
  return Response.json(result);
}
