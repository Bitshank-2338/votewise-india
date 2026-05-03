import { NextRequest } from "next/server";
import { rateLimit, getClientIP } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/sanitize";
import { searchVoterEducationVideos } from "@/lib/google/youtube";

/**
 * GET /api/videos?q=...
 * Proxies the YouTube Data API v3 search endpoint and returns curated
 * voter-education videos. Falls back to an empty list when YOUTUBE_API_KEY
 * is unset.
 */
export async function GET(req: NextRequest) {
  const ip = getClientIP(req.headers);
  const { limited, resetIn } = rateLimit(`yt:${ip}`, 30, 60_000);
  if (limited) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) },
      }
    );
  }

  const raw = req.nextUrl.searchParams.get("q") || "";
  const query = sanitizeInput(raw).slice(0, 100) ||
    "Election Commission of India voter education";

  const videos = await searchVoterEducationVideos(query, 8);
  return Response.json({ videos });
}
