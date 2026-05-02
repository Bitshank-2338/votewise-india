"use client";
import React, { useEffect, useRef } from "react";
import { useLang } from "@/components/LanguageProvider";

export function ElectionTimeline() {
  const { t } = useLang();
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const phases = [
    { icon: "📢", title: t.tl_p1_title, sub: t.tl_p1_sub, desc: t.tl_p1_desc },
    { icon: "📋", title: t.tl_p2_title, sub: t.tl_p2_sub, desc: t.tl_p2_desc },
    { icon: "📣", title: t.tl_p3_title, sub: t.tl_p3_sub, desc: t.tl_p3_desc },
    { icon: "🪪", title: t.tl_p4_title, sub: t.tl_p4_sub, desc: t.tl_p4_desc },
    { icon: "🗳️", title: t.tl_p5_title, sub: t.tl_p5_sub, desc: t.tl_p5_desc },
    { icon: "📊", title: t.tl_p6_title, sub: t.tl_p6_sub, desc: t.tl_p6_desc },
    { icon: "🏛️", title: t.tl_p7_title, sub: t.tl_p7_sub, desc: t.tl_p7_desc },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.15 }
    );
    itemsRef.current.forEach((item) => { if (item) observer.observe(item); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="timeline">
      {phases.map((phase, i) => (
        <div key={i} className="timeline-item" ref={(el) => { itemsRef.current[i] = el; }} style={{ transitionDelay: `${i * 0.08}s` }}>
          <div className="timeline-dot" />
          <div className="timeline-content">
            <div className="timeline-date">{t.tl_phase} {i + 1} — {phase.sub}</div>
            <h3>{phase.icon} {phase.title}</h3>
            <p>{phase.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
