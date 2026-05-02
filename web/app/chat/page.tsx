"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/components/LanguageProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "votewise-chat-history";

function loadMessages(fallback: Message): Message[] {
  if (typeof window === "undefined") return [fallback];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [fallback];
}

function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch { /* quota exceeded — ignore */ }
}

/** Simple markdown-like rendering for AI responses */
function renderContent(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} style={{ paddingLeft: 18, margin: "8px 0" }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Bullet points
    if (/^[\-\*•]\s+/.test(line)) {
      listItems.push(line.replace(/^[\-\*•]\s+/, ""));
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      listItems.push(line.replace(/^\d+\.\s+/, ""));
      continue;
    }

    flushList();

    // Heading-like bold lines
    if (/^\*\*(.+)\*\*$/.test(line)) {
      elements.push(
        <p key={i} style={{ fontWeight: 600, marginTop: 12, marginBottom: 4 }}>
          {line.replace(/\*\*/g, "")}
        </p>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<br key={i} />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} style={{ margin: "2px 0" }}>
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  return <>{elements}</>;
}

/** Render inline bold/italic */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function ChatPage() {
  const { t } = useLang();
  const welcomeMsg: Message = { role: "assistant", content: t.chat_welcome };
  const [messages, setMessages] = useState<Message[]>([welcomeMsg]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const quickQs = [t.chat_q1, t.chat_q2, t.chat_q3, t.chat_q4, t.chat_q5, t.chat_q6, t.chat_q7, t.chat_q8];

  useEffect(() => {
    setMessages(loadMessages(welcomeMsg));
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hydrated) saveMessages(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([welcomeMsg]);
    localStorage.removeItem(STORAGE_KEY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              res.status === 429
                ? `⏳ You're sending messages too fast. Please wait a moment and try again.`
                : `⚠️ ${data.error}`,
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "😔 Sorry, I couldn't connect to the AI service. Please check your internet connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-avatar">🗳️</div>
        <div className="chat-header-info" style={{ flex: 1 }}>
          <h2>{t.chat_header_title}</h2>
          <p>
            <span className="online-dot"></span>
            {t.chat_header_sub}
          </p>
        </div>
        {messages.length > 1 && (
          <button
            onClick={clearChat}
            className="btn btn-sm"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              border: "1px solid var(--bg-glass-border)",
              fontSize: "0.78rem",
              padding: "6px 14px",
            }}
            title="Clear chat history"
          >
            🗑️ {t.chat_clear}
          </button>
        )}
      </div>

      {/* Quick actions (shown when few messages) */}
      {messages.length <= 1 && (
        <div className="quick-actions">
          {quickQs.map((q) => (
            <button
              key={q}
              className="quick-chip"
              onClick={() => sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="chat-avatar">
              {msg.role === "assistant" ? "🗳️" : "👤"}
            </div>
            <div className="chat-bubble">
              {msg.role === "assistant"
                ? renderContent(msg.content)
                : msg.content.split("\n").map((line, j) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < msg.content.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            <div className="chat-avatar">🗳️</div>
            <div className="chat-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chat_placeholder}
            rows={1}
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          {t.chat_disclaimer}
        </p>
      </div>
    </div>
  );
}
