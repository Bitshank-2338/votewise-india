"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { LangCode, Translations, LANGUAGES, getTranslations } from "@/lib/i18n";

interface LangContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: getTranslations("en"),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("votewise-lang") as LangCode;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    localStorage.setItem("votewise-lang", l);
    document.documentElement.setAttribute("lang", l);
  }, []);

  const t = getTranslations(lang);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
