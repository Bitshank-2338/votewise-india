"use client";
import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - var(--navbar-height) - 64px)", textAlign: "center", padding: "40px 24px" }}>
      <div className="ashoka-chakra" />
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: 12 }}>
        <span className="gradient-text">{t.not_found_title}</span>
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: 450, marginBottom: 32, lineHeight: 1.6 }}>{t.not_found_msg}</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn-primary">{t.not_found_home}</Link>
        <Link href="/chat" className="btn btn-secondary">{t.not_found_ai}</Link>
        <Link href="/tools" className="btn btn-secondary">{t.not_found_tools}</Link>
      </div>
    </div>
  );
}
