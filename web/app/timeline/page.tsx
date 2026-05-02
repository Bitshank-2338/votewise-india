"use client";
import Link from "next/link";
import { ElectionTimeline } from "@/components/timeline/ElectionTimeline";
import { useLang } from "@/components/LanguageProvider";

export default function TimelinePage() {
  const { t } = useLang();
  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="section-header">
        <h2>🗓️ {t.tl_title}</h2>
        <p>{t.tl_subtitle}</p>
        <div className="divider"></div>
      </div>
      <ElectionTimeline />
      <div className="cta-banner" style={{ marginTop: 60 }}>
        <h2>{t.cta_timeline_title}</h2>
        <p>{t.cta_timeline_sub}</p>
        <Link href="/chat" className="btn btn-primary">{t.hero_btn_ai}</Link>
      </div>
    </div>
  );
}
