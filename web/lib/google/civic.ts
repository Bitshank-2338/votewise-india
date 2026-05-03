/**
 * Google Civic Information API client.
 * https://developers.google.com/civic-information
 *
 * Used to fetch nonpartisan information about elected representatives,
 * polling locations, and election dates by address. The Civic API has
 * limited coverage outside the US, so we expose only the methods we use
 * and gracefully degrade when the API returns no data for an Indian PIN.
 */

const CIVIC_BASE = "https://www.googleapis.com/civicinfo/v2";

export interface CivicRepresentative {
  name: string;
  party?: string;
  office: string;
  phones?: string[];
  urls?: string[];
}

export interface CivicResponse {
  representatives: CivicRepresentative[];
  source: "google-civic" | "fallback";
}

/** Look up representatives by free-form address. Falls back gracefully. */
export async function getRepresentatives(
  address: string
): Promise<CivicResponse> {
  const key = process.env.GOOGLE_CIVIC_API_KEY;
  if (!key) return { representatives: [], source: "fallback" };

  try {
    const url = `${CIVIC_BASE}/representatives?key=${key}&address=${encodeURIComponent(
      address
    )}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { representatives: [], source: "fallback" };

    const data: {
      officials?: Array<{
        name: string;
        party?: string;
        phones?: string[];
        urls?: string[];
      }>;
      offices?: Array<{ name: string; officialIndices?: number[] }>;
    } = await res.json();

    const officials = data.officials || [];
    const offices = data.offices || [];
    const reps: CivicRepresentative[] = [];

    for (const office of offices) {
      for (const idx of office.officialIndices || []) {
        const o = officials[idx];
        if (!o) continue;
        reps.push({
          name: o.name,
          party: o.party,
          office: office.name,
          phones: o.phones,
          urls: o.urls,
        });
      }
    }

    return { representatives: reps, source: "google-civic" };
  } catch {
    return { representatives: [], source: "fallback" };
  }
}
