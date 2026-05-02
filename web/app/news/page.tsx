"use client";
import React, { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";

interface Article {
  title: string;
  description: string;
  url: string;
  image: string | null;
  source: string;
  date: string;
  category: string;
}

export default function NewsPage() {
  const { t } = useLang();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const categories = [
    { key: "All", label: t.news_all },
    { key: "Politics", label: t.news_politics },
    { key: "Technology", label: t.news_tech },
    { key: "Business", label: t.news_business },
    { key: "World", label: t.news_world },
  ];

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const catQuery = activeFilter === "All" ? "all" : activeFilter.toLowerCase();
        const res = await fetch(`/api/news?category=${catQuery}`);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch { setArticles([]); }
      finally { setLoading(false); }
    })();
  }, [activeFilter]);

  const filtered = articles;

  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="section-header">
        <h2>📰 {t.news_title}</h2>
        <p>{t.news_subtitle}</p>
        <div className="divider"></div>
      </div>

      <div className="filter-bar" role="tablist" aria-label="News Categories">
        {categories.map((cat) => (
          <button key={cat.key} className={`filter-chip ${activeFilter === cat.key ? "active" : ""}`} onClick={() => setActiveFilter(cat.key)} aria-pressed={activeFilter === cat.key} role="tab">
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="news-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="news-card">
              <div className="skeleton" style={{ height: 180, borderRadius: "16px 16px 0 0" }} />
              <div className="news-card-body">
                <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 18, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 48 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
          <p style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</p>
          <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>{t.news_empty}</p>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveFilter("All")}>{t.news_show_all}</button>
        </div>
      ) : (
        <div className="news-grid">
          {filtered.map((article, i) => (
            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="news-card">
                {article.image ? (
                  <img className="news-card-img" src={article.image} alt={article.title} loading="lazy" decoding="async" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="news-card-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", background: "var(--gradient-card)" }}>🗳️</div>
                )}
                <div className="news-card-body">
                  <div className="news-card-meta">
                    <span className="news-badge politics">{article.category}</span>
                    <span className="news-card-date">{article.source} · {formatDate(article.date)}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.description ? article.description.slice(0, 150) + "..." : ""}</p>
                  <span className="news-card-link">{t.news_read_more}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
