/**
 * Google Maps Embed API helpers for polling booth and ECI office lookups.
 * Uses the Maps Embed API (free, public-key constraint) — does NOT expose
 * a paid API key to the browser when NEXT_PUBLIC_GOOGLE_MAPS_KEY is unset.
 */

const MAPS_EMBED_BASE = "https://www.google.com/maps/embed/v1";

/** Build a Google Maps Embed URL for a place query (e.g. "polling booth Mumbai 400001"). */
export function buildPlaceEmbedUrl(query: string): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (key) {
    return `${MAPS_EMBED_BASE}/place?key=${key}&q=${encodeURIComponent(query)}`;
  }
  // Fallback: the keyless Maps "search" embed (public, no key required).
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

/** Build a Google Maps directions URL the user can open in a new tab. */
export function buildDirectionsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination
  )}`;
}

/** Build a Google Maps search URL for a polling-booth lookup by PIN code. */
export function buildBoothSearchUrl(pincode: string): string {
  const safe = pincode.replace(/[^0-9]/g, "").slice(0, 6);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `polling booth ${safe} India`
  )}`;
}
