"use client";
import React, { useState } from "react";
import { useLang } from "@/components/LanguageProvider";

export function FAQ() {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    { q: t.faq_q1, a: t.faq_a1 },
    { q: t.faq_q2, a: t.faq_a2 },
    { q: t.faq_q3, a: t.faq_a3 },
    { q: t.faq_q4, a: t.faq_a4 },
    { q: t.faq_q5, a: t.faq_a5 },
    { q: t.faq_q6, a: t.faq_a6 },
  ];

  return (
    <div className="faq-section">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
          <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            <span>{item.q}</span>
            <span className="faq-chevron">▼</span>
          </button>
          <div className="faq-answer"><p>{item.a}</p></div>
        </div>
      ))}
    </div>
  );
}
