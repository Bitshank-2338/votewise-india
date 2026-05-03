/**
 * Google Cloud Translation API v2 client.
 * https://cloud.google.com/translate/docs/reference/rest/v2/translate
 *
 * Used as a runtime fallback when a translation key is missing from a static
 * locale bundle. Static i18n files remain the primary source — this is only
 * invoked for user-generated text (e.g. AI chat responses, news headlines).
 */

const TRANSLATE_BASE = "https://translation.googleapis.com/language/translate/v2";

export interface TranslateResult {
  translatedText: string;
  detectedSourceLanguage?: string;
  source: "google-translate" | "passthrough";
}

/**
 * Translate text into the given target locale.
 * Falls back to passthrough when GOOGLE_TRANSLATE_API_KEY is unset or the
 * upstream call fails — never throws.
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslateResult> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key || !text) {
    return { translatedText: text, source: "passthrough" };
  }

  try {
    const url = `${TRANSLATE_BASE}?key=${key}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: sourceLang,
        format: "text",
      }),
    });
    if (!res.ok) return { translatedText: text, source: "passthrough" };

    const data: {
      data?: {
        translations?: Array<{
          translatedText: string;
          detectedSourceLanguage?: string;
        }>;
      };
    } = await res.json();

    const t = data.data?.translations?.[0];
    if (!t) return { translatedText: text, source: "passthrough" };

    return {
      translatedText: t.translatedText,
      detectedSourceLanguage: t.detectedSourceLanguage,
      source: "google-translate",
    };
  } catch {
    return { translatedText: text, source: "passthrough" };
  }
}
