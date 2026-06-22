"use client";

import { useState } from "react";

interface Props {
  onIndexed: (repoUrl: string) => void;
  isIndexing: boolean;
  setIsIndexing: (v: boolean) => void;
}

export default function RepoInput({ onIndexed, isIndexing, setIsIndexing }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleIndex = async () => {
    if (!url.trim()) return;
    if (!url.includes("github.com")) {
      setError("Enter a valid GitHub URL");
      return;
    }
    setError("");
    setIsIndexing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: url }),
      });
      if (!res.ok) throw new Error("Failed");
      onIndexed(url);
    } catch {
      setError("Failed to index. Is the backend running?");
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p style={{ color: "#ffffff", fontSize: "11px", letterSpacing: "0.12em", fontWeight: 600 }} className="uppercase">Index Repository</p>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleIndex()}
        placeholder="https://github.com/user/repo"
        style={{
          backgroundColor: "#111",
          border: "1px solid #555",
          color: "#ffffff",
          fontSize: "12px",
          padding: "10px 12px",
          outline: "none",
          fontFamily: "'JetBrains Mono', monospace",
          width: "100%",
        }}
        onFocus={e => (e.target.style.borderColor = "#ffffff")}
        onBlur={e => (e.target.style.borderColor = "#555")}
      />
      {error && <p style={{ color: "#ff6b6b", fontSize: "11px" }}>{error}</p>}
      <button
        onClick={handleIndex}
        disabled={isIndexing || !url.trim()}
        style={{
          border: "1px solid",
          borderColor: isIndexing || !url.trim() ? "#333" : "#ffffff",
          color: isIndexing || !url.trim() ? "#444" : "#ffffff",
          backgroundColor: "transparent",
          fontSize: "11px",
          fontWeight: "700",
          padding: "10px",
          letterSpacing: "0.08em",
          cursor: isIndexing || !url.trim() ? "not-allowed" : "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          if (!isIndexing && url.trim()) {
            (e.target as HTMLButtonElement).style.backgroundColor = "#ffffff";
            (e.target as HTMLButtonElement).style.color = "#000000";
          }
        }}
        onMouseLeave={e => {
          (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.target as HTMLButtonElement).style.color = isIndexing || !url.trim() ? "#444" : "#ffffff";
        }}
      >
        {isIndexing ? "INDEXING..." : "INDEX REPOSITORY →"}
      </button>
    </div>
  );
}
