import { NextRequest } from "next/server";
import { rateLimit, getClientIP } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/sanitize";
import { getRepresentatives } from "@/lib/google/civic";

/**
 * GET /api/representatives?address=...
 * Proxies the Google Civic Information API. Returns nonpartisan data only.
 */
export async function GET(req: NextRequest) {
  const ip = getClientIP(req.headers);
  const { limited, resetIn } = rateLimit(`civic:${ip}`, 20, 60_000);
  if (limited) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) },
      }
    );
  }

  const raw = req.nextUrl.searchParams.get("address") || "";
  const address = sanitizeInput(raw).slice(0, 200);
  if (!address) {
    return Response.json({ error: "Address required" }, { status: 400 });
  }

  const result = await getRepresentatives(address);
  return Response.json(result);
}
