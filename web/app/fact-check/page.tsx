"use client";

import React, { useState } from "react";
import { useLang } from "@/components/LanguageProvider";

interface FactCheckResult {
  verdict: "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIABLE";
  confidence: number;
  explanation: string;
  source: string;
}

export default function FactCheckPage() {
  const { t } = useLang();
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!claim.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/factcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to analyze claim.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const speakResult = () => {
    if (!result || !("speechSynthesis" in window)) return;
    const text = `The verdict is ${result.verdict}. ${result.explanation}`;
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find an English/Indian voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("hi-IN"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "TRUE": return "#10b981"; // Green
      case "FALSE": return "#ef4444"; // Red
      case "MISLEADING": return "#f59e0b"; // Yellow
      default: return "#6b7280"; // Gray
    }
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: "800px" }}>
      <div className="section-header">
        <h2>🛡️ {t.fc_title || "Misinformation Shield"}</h2>
        <p>{t.fc_subtitle || "Paste a political claim, WhatsApp forward, or news headline to instantly verify its authenticity with AI."}</p>
        <div className="divider" style={{ margin: "24px auto" }}></div>
      </div>

      <div style={{ background: "var(--bg-elevated)", padding: "24px", borderRadius: "16px", border: "1px solid var(--bg-glass-border)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
        <textarea 
          className="chat-input"
          style={{ width: "100%", minHeight: "120px", padding: "16px", fontSize: "1.1rem", borderRadius: "12px", border: "1px solid var(--bg-glass-border)", background: "var(--bg-primary)", color: "var(--text-primary)", resize: "vertical" }}
          placeholder={t.fc_placeholder || "Paste the claim or message here..."}
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          disabled={loading}
          aria-label="Enter claim to fact check"
        />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
            {t.fc_disclaimer || "AI can make mistakes. Always verify with official ECI sources."}
          </p>
          <button 
            className="btn btn-primary" 
            onClick={handleCheck} 
            disabled={!claim.trim() || loading}
            aria-label="Analyze Claim"
          >
            {loading ? "Analyzing..." : t.fc_btn || "Analyze Claim"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: "24px", padding: "16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: "12px", color: "#ef4444" }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "32px", animation: "slideUp 0.4s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Analysis Result</h3>
            <button 
              onClick={speakResult}
              className="btn btn-sm" 
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-glass-border)" }}
              aria-label="Read aloud result"
              title="Read aloud"
            >
              🔊 Read Aloud
            </button>
          </div>

          <div style={{ 
            background: "var(--bg-elevated)", 
            borderRadius: "16px", 
            border: `2px solid ${getVerdictColor(result.verdict)}`,
            overflow: "hidden"
          }}>
            <div style={{ background: getVerdictColor(result.verdict), color: "#fff", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "1px" }}>
                {result.verdict}
              </span>
              <span style={{ fontWeight: 600, opacity: 0.9 }}>
                Confidence: {result.confidence}%
              </span>
            </div>
            
            <div style={{ padding: "24px" }}>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "20px" }}>
                {result.explanation}
              </p>
              
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--bg-primary)", padding: "8px 16px", borderRadius: "20px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                <span>🔍</span>
                <span><strong>Recommended Source:</strong> {result.source}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
