import { getTranslations, t, LANGUAGES, LangCode } from "../lib/i18n";

describe("i18n / multilingual support", () => {
  it("ships exactly 14 supported languages", () => {
    expect(LANGUAGES.length).toBe(14);
  });

  it("includes all major Indian script families", () => {
    const codes = LANGUAGES.map((l) => l.code);
    for (const c of [
      "en",
      "hi",
      "bn",
      "te",
      "ta",
      "mr",
      "gu",
      "kn",
      "ml",
      "pa",
      "ur",
      "or",
      "as",
      "mni",
    ] as LangCode[]) {
      expect(codes).toContain(c);
    }
  });

  it("returns English translations by default", () => {
    const tr = getTranslations("en");
    expect(tr).toBeDefined();
    expect(typeof tr.hero_title_1).toBe("string");
  });

  it("returns localized translations for Hindi", () => {
    const tr = getTranslations("hi");
    expect(tr).toBeDefined();
    // Hero title should not be the English value
    expect(tr.hero_title_2).not.toBe(getTranslations("en").hero_title_2);
  });

  it("falls back to English for unknown lang codes", () => {
    // @ts-expect-error -- intentional invalid lang for fallback test
    const tr = getTranslations("xx");
    const en = getTranslations("en");
    expect(tr.hero_title_1).toBe(en.hero_title_1);
  });

  it("t() returns the translated string for a key", () => {
    const value = t("hi", "hero_title_2");
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it("t() falls back to English when a key is missing", () => {
    const value = t("mni", "hero_title_1");
    expect(typeof value).toBe("string");
  });

  it("each language entry has a non-empty native name", () => {
    for (const lang of LANGUAGES) {
      expect(lang.nativeName.length).toBeGreaterThan(0);
      expect(lang.script.length).toBeGreaterThan(0);
    }
  });
});
