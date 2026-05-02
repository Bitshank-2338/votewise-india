"use client";
import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

const DOCS = [
  "EPIC (Voter ID Card)", "Aadhaar Card", "Passport", "Driving License",
  "PAN Card", "Bank Passbook with Photo", "MNREGA Job Card",
  "Service Identity Card (Govt.)", "Pension Document with Photo",
  "NPR Smart Card", "Student ID (Govt. institution)", "MP/MLA/MLC Identity Card",
];

export default function ToolsPage() {
  const { t } = useLang();

  const tools = [
    { icon: "🔍", title: t.tools_check_reg, desc: t.tools_check_reg_desc, link: "https://electoralsearch.eci.gov.in/", color: "hsla(217,91%,60%,0.12)" },
    { icon: "📋", title: t.tools_register, desc: t.tools_register_desc, link: "https://voters.eci.gov.in/", color: "hsla(120,60%,35%,0.12)" },
    { icon: "📍", title: t.tools_find_booth, desc: t.tools_find_booth_desc, link: "https://electoralsearch.eci.gov.in/", color: "hsla(30,100%,50%,0.12)" },
    { icon: "👤", title: t.tools_know_candidate, desc: t.tools_know_candidate_desc, link: "https://affidavit.eci.gov.in/", color: "hsla(260,70%,55%,0.12)" },
    { icon: "📱", title: t.tools_helpline_app, desc: t.tools_helpline_app_desc, link: "https://play.google.com/store/apps/details?id=com.eci.citizen", color: "hsla(173,80%,40%,0.12)" },
    { icon: "📞", title: t.tools_contact_eci, desc: t.tools_contact_eci_desc, link: "tel:1950", color: "hsla(0,84%,55%,0.12)" },
  ];

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="section-header">
        <h2>🛠️ {t.tools_title}</h2>
        <p>{t.tools_subtitle}</p>
        <div className="divider"></div>
      </div>
      <div className="features-grid" style={{ marginBottom: 60 }}>
        {tools.map((tool) => (
          <a key={tool.title} href={tool.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="feature-card">
              <div className="icon" style={{ background: tool.color }}>{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
            </div>
          </a>
        ))}
      </div>
      <div className="section-header">
        <h2>🪪 {t.tools_docs_title}</h2>
        <p>{t.tools_docs_subtitle}</p>
        <div className="divider"></div>
      </div>
      <div style={{ maxWidth: 650, margin: "0 auto", display: "grid", gap: 8 }}>
        {DOCS.map((doc, i) => (
          <div key={doc} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: "var(--radius-md)", background: "var(--gradient-card)", border: "1px solid var(--bg-glass-border)" }}>
            <span style={{ fontSize: "1.2rem" }}>{i === 0 ? "⭐" : "✅"}</span>
            <span style={{ flex: 1, fontSize: "0.92rem" }}>{doc}</span>
            {i === 0 && <span className="news-badge update" style={{ fontSize: "0.65rem" }}>Primary</span>}
          </div>
        ))}
      </div>
      <div className="cta-banner" style={{ marginTop: 60 }}>
        <h2>{t.cta_tools_title}</h2>
        <p>{t.cta_tools_sub}</p>
        <Link href="/chat" className="btn btn-primary">{t.hero_btn_ai}</Link>
      </div>
    </div>
  );
}
