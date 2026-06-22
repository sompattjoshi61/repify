"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  indexedRepo: string | null;
}

const SUGGESTIONS = [
  "How does authentication work?",
  "Where is the payment integration?",
  "Explain the folder structure",
  "Which API handles user login?",
];

export default function ChatWindow({ indexedRepo }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const question = text || input;
    if (!question.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, repo_url: indexedRepo }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not connect to backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#000", fontFamily: "'JetBrains Mono', monospace" }}>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "24px", textAlign: "center" }}>
            <div>
              <p style={{ color: "#888", fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px" }}>REPIFY</p>
              <p style={{ color: "#cccccc", fontSize: "13px" }}>
                {indexedRepo ? "Repository indexed. Ask anything about the code." : "Index a repository from the sidebar to get started."}
              </p>
            </div>
            {indexedRepo && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxWidth: "500px", width: "100%" }}>
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      border: "1px solid #444",
                      backgroundColor: "transparent",
                      color: "#cccccc",
                      fontSize: "11px",
                      padding: "12px 14px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "'JetBrains Mono', monospace",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffffff";
                      (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#111";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#444";
                      (e.currentTarget as HTMLButtonElement).style.color = "#cccccc";
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                  >
                    <span style={{ color: "#333", marginRight: "8px" }}>›</span>{q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: "4px" }}>
            <span style={{ fontSize: "10px", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", paddingLeft: "2px" }}>
              {msg.role === "user" ? "YOU" : "REPIFY"}
            </span>
            <div style={{
              maxWidth: "640px",
              fontSize: "12px",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
              padding: "12px 16px",
              backgroundColor: msg.role === "user" ? "#ffffff" : "#0d0d0d",
              color: msg.role === "user" ? "#000000" : "#ffffff",
              border: msg.role === "assistant" ? "1px solid #444" : "none",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
            <span style={{ fontSize: "10px", color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>REPIFY</span>
            <div style={{ border: "1px solid #2a2a2a", backgroundColor: "#0d0d0d", padding: "12px 16px" }}>
              <span style={{ color: "#555", fontSize: "12px" }}>thinking<span className="animate-pulse">...</span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ borderTop: "1px solid #222", padding: "16px", backgroundColor: "#000" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={indexedRepo ? "Ask anything about the codebase..." : "Index a repository first..."}
            disabled={!indexedRepo}
            style={{
              flex: 1,
              backgroundColor: "#0d0d0d",
              border: "1px solid #333",
              color: "#ffffff",
              fontSize: "12px",
              padding: "12px 16px",
              outline: "none",
              fontFamily: "'JetBrains Mono', monospace",
              opacity: indexedRepo ? 1 : 0.4,
            }}
            onFocus={e => (e.target.style.borderColor = "#666")}
            onBlur={e => (e.target.style.borderColor = "#333")}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading || !indexedRepo}
            style={{
              backgroundColor: input.trim() && !loading && indexedRepo ? "#ffffff" : "transparent",
              border: "1px solid",
              borderColor: input.trim() && !loading && indexedRepo ? "#ffffff" : "#333",
              color: input.trim() && !loading && indexedRepo ? "#000000" : "#444",
              fontSize: "11px",
              fontWeight: "700",
              padding: "12px 20px",
              letterSpacing: "0.08em",
              cursor: input.trim() && !loading && indexedRepo ? "pointer" : "not-allowed",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
