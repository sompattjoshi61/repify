"use client";

import { useState } from "react";

interface Props {
  indexedRepo: string | null;
}

export default function DiagramUpload({ indexedRepo }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (indexedRepo) formData.append("repo_url", indexedRepo);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-diagram`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      setUploaded(true);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
      <p style={{ color: "#ffffff", fontSize: "11px", letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" }}>
        Architecture Diagram
      </p>
      <label style={{
        border: "1px dashed #555",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        display: "block",
        transition: "border-color 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffffff")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#555")}
      >
        <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
        {uploading ? (
          <p style={{ color: "#aaa", fontSize: "12px" }}>Uploading...</p>
        ) : uploaded ? (
          <p style={{ color: "#ffffff", fontSize: "12px" }}>✓ Diagram indexed</p>
        ) : (
          <>
            <p style={{ color: "#cccccc", fontSize: "12px" }}>Click to upload PNG / JPG</p>
            <p style={{ color: "#777", fontSize: "10px", marginTop: "4px" }}>Architecture · ER diagrams · Flowcharts</p>
          </>
        )}
      </label>
      {error && <p style={{ color: "#ff6b6b", fontSize: "11px" }}>{error}</p>}
    </div>
  );
}
