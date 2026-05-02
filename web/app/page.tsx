"use client";

import Link from "next/link";
import { ElectionTimeline } from "@/components/timeline/ElectionTimeline";
import { FAQ } from "@/components/FAQ";
import { useLang } from "@/components/LanguageProvider";

export default function HomePage() {
  const { t } = useLang();

  const stats = [
    { value: "96.8 Cr", label: t.stat_voters },
    { value: "543", label: t.stat_seats },
    { value: "10.5 L+", label: t.stat_booths },
    { value: "7", label: t.stat_phases },
  ];

  return (
    <>
      {/* Tricolor stripe */}
      <div className="tricolor-stripe" />

      {/* Ticker */}
      <div className="ticker-bar">
        <div className="ticker-content">
          <span>🗳️ <span className="highlight">{t.ticker_1}</span></span>
          <span>📋 {t.ticker_2}</span>
          <span>🪪 {t.ticker_3}</span>
          <span>📱 {t.ticker_4}</span>
          <span>🗳️ <span className="highlight">{t.ticker_1}</span></span>
          <span>📋 {t.ticker_2}</span>
          <span>🪪 {t.ticker_3}</span>
          <span>📱 {t.ticker_4}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="ashoka-chakra" />
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            {t.hero_badge}
          </div>
          <h1>
            {t.hero_title_1}{" "}
            <span className="gradient-text">{t.hero_title_2}</span>
          </h1>
          <p className="subtitle">{t.hero_subtitle}</p>
          <div className="hero-actions">
            <Link href="/chat" className="btn btn-primary">{t.hero_btn_ai}</Link>
            <Link href="/news" className="btn btn-secondary">{t.hero_btn_news}</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container">
        <div className="stats-bar">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>{t.feat_title}</h2>
            <p>{t.feat_subtitle}</p>
            <div className="divider"></div>
          </div>
          <div className="features-grid">
            <Link href="/chat" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="feature-card">
                <div className="icon">🤖</div>
                <h3>{t.feat_ai_title}</h3>
                <p>{t.feat_ai_desc}</p>
              </div>
            </Link>
            <Link href="/timeline" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="feature-card">
                <div className="icon">🗓️</div>
                <h3>{t.feat_timeline_title}</h3>
                <p>{t.feat_timeline_desc}</p>
              </div>
            </Link>
            <Link href="/news" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="feature-card">
                <div className="icon">📰</div>
                <h3>{t.feat_news_title}</h3>
                <p>{t.feat_news_desc}</p>
              </div>
            </Link>
            <Link href="/tools" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="feature-card">
                <div className="icon">🛠️</div>
                <h3>{t.feat_tools_title}</h3>
                <p>{t.feat_tools_desc}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="section-header">
            <h2>{t.tl_title}</h2>
            <p>{t.tl_subtitle}</p>
            <div className="divider"></div>
          </div>
          <ElectionTimeline />
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>{t.faq_title}</h2>
            <p>{t.faq_subtitle}</p>
            <div className="divider"></div>
          </div>
          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <h2>{t.cta_title}</h2>
            <p>{t.cta_subtitle}</p>
            <Link href="/chat" className="btn btn-primary">{t.cta_btn}</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <Link href="/chat">{t.nav_ask_ai}</Link>
            <Link href="/tools">{t.nav_tools}</Link>
            <Link href="/timeline">{t.nav_timeline}</Link>
            <Link href="/news">{t.nav_news}</Link>
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer">ECI</a>
            <a href="https://nvsp.in" target="_blank" rel="noopener noreferrer">NVSP</a>
          </div>
          <div className="footer-divider"></div>
          <p>{t.footer_text}<br />{t.footer_disclaimer}</p>
        </div>
      </footer>
      <div className="tricolor-stripe" />
    </>
  );
}
