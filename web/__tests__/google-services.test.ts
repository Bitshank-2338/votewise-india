/**
 * Unit tests for the Google services integration layer.
 * These tests verify graceful fallback behavior when API keys are absent
 * and that URL builders escape user input correctly.
 */
import {
  buildPlaceEmbedUrl,
  buildDirectionsUrl,
  buildBoothSearchUrl,
} from "../lib/google/maps";
import { buildEmbedUrl } from "../lib/google/youtube";
import { translateText } from "../lib/google/translate";
import { getRepresentatives } from "../lib/google/civic";
import { searchVoterEducationVideos } from "../lib/google/youtube";
import { getFirebaseConfig, isFirebaseEnabled } from "../lib/google/firebase";

describe("Google Maps URL builders", () => {
  it("builds keyless place embed when no key is set", () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const url = buildPlaceEmbedUrl("polling booth Mumbai 400001");
    expect(url).toMatch(/^https:\/\/maps\.google\.com\/maps/);
    expect(url).toContain("output=embed");
  });

  it("uses Maps Embed API when a key is configured", () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY = "test-key";
    const url = buildPlaceEmbedUrl("Mumbai");
    expect(url).toContain("google.com/maps/embed/v1/place");
    expect(url).toContain("key=test-key");
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  });

  it("URL-encodes the place query", () => {
    const url = buildPlaceEmbedUrl("Connaught Place, New Delhi");
    expect(url).toContain("Connaught%20Place");
  });

  it("builds a directions URL", () => {
    const url = buildDirectionsUrl("ECI HQ Delhi");
    expect(url).toContain("/maps/dir/?api=1");
    expect(url).toContain("destination=ECI");
  });

  it("strips non-digit characters from PIN codes", () => {
    const url = buildBoothSearchUrl("400-001<script>");
    expect(url).toContain("polling%20booth%20400001");
    expect(url).not.toContain("script");
  });

  it("limits PIN codes to 6 digits", () => {
    const url = buildBoothSearchUrl("4000019999999");
    expect(url).toContain("polling%20booth%20400001");
    expect(url).not.toContain("9999999");
  });
});

describe("YouTube embed URL", () => {
  it("uses youtube-nocookie domain for privacy", () => {
    expect(buildEmbedUrl("abc123XYZ")).toContain("youtube-nocookie.com/embed/");
  });

  it("strips unsafe characters from video IDs", () => {
    const url = buildEmbedUrl("abc<script>alert(1)</script>");
    expect(url).not.toMatch(/<|>/);
    expect(url).toContain("abcscriptalert1script");
  });

  it("includes safe defaults: rel=0 and modestbranding", () => {
    const url = buildEmbedUrl("safeId123");
    expect(url).toContain("rel=0");
    expect(url).toContain("modestbranding=1");
  });
});

describe("Google Translate fallback behaviour", () => {
  beforeEach(() => {
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
  });

  it("returns passthrough when no API key is set", async () => {
    const r = await translateText("Hello", "hi");
    expect(r.source).toBe("passthrough");
    expect(r.translatedText).toBe("Hello");
  });

  it("returns passthrough for empty input", async () => {
    process.env.GOOGLE_TRANSLATE_API_KEY = "fake";
    const r = await translateText("", "hi");
    expect(r.source).toBe("passthrough");
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
  });
});

describe("Google Civic Information fallback behaviour", () => {
  beforeEach(() => {
    delete process.env.GOOGLE_CIVIC_API_KEY;
  });

  it("returns an empty fallback when no key is set", async () => {
    const r = await getRepresentatives("Mumbai 400001");
    expect(r.source).toBe("fallback");
    expect(r.representatives).toEqual([]);
  });
});

describe("YouTube Data API fallback behaviour", () => {
  beforeEach(() => {
    delete process.env.YOUTUBE_API_KEY;
  });

  it("returns an empty array when no API key is set", async () => {
    const videos = await searchVoterEducationVideos("ECI");
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBe(0);
  });
});

describe("Firebase configuration", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  });

  it("returns null when env vars are missing", () => {
    expect(getFirebaseConfig()).toBeNull();
    expect(isFirebaseEnabled()).toBe(false);
  });

  it("returns a config with sensible defaults when keys are set", () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "fake-key";
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "votewise-india";
    const cfg = getFirebaseConfig();
    expect(cfg).not.toBeNull();
    expect(cfg?.projectId).toBe("votewise-india");
    expect(cfg?.authDomain).toBe("votewise-india.firebaseapp.com");
    expect(cfg?.storageBucket).toBe("votewise-india.appspot.com");
    expect(isFirebaseEnabled()).toBe(true);
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  });
});
