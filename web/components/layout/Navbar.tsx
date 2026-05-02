"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useLang } from "@/components/LanguageProvider";
import { LANGUAGES } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav_home },
    { href: "/chat", label: t.nav_ask_ai },
    { href: "/tools", label: t.nav_tools },
    { href: "/news", label: t.nav_news },
    { href: "/fact-check", label: t.nav_factcheck || "Fact Check" },
    { href: "/timeline", label: t.nav_timeline },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <span className="flag" style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
          <span style={{ color: '#FF9933', fontSize: '1.2rem', lineHeight: 1 }}>●</span>
          <span style={{ color: '#FFFFFF', fontSize: '1.2rem', lineHeight: 1 }}>●</span>
          <span style={{ color: '#138808', fontSize: '1.2rem', lineHeight: 1 }}>●</span>
        </span>
        VoteWise
      </Link>

      <button
        className="mobile-nav-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      <ul className={`navbar-links ${mobileOpen ? "open" : ""}`}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={pathname === link.href ? "active" : ""}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li style={{ position: "relative" }}>
          <button
            className="lang-toggle"
            onClick={() => setLangOpen(!langOpen)}
            aria-label="Change language"
            title="Change language"
          >
            🌐 {currentLang?.nativeName || "EN"}
          </button>
          {langOpen && (
            <>
              <div className="lang-backdrop" onClick={() => setLangOpen(false)} />
              <div className="lang-dropdown">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    className={`lang-option ${lang === l.code ? "active" : ""}`}
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                  >
                    <span className="lang-native">{l.nativeName}</span>
                    <span className="lang-english">{l.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </li>
        <li>
          <button
            className="theme-toggle"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
