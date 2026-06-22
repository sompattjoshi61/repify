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
      setError("Please enter a valid GitHub URL");
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

      if (!res.ok) throw new Error("Failed to index repository");

      onIndexed(url);
    } catch (err) {
      setError("Failed to index. Make sure the backend is running.");
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-white font-semibold text-sm">Index a Repository</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleIndex()}
        placeholder="https://github.com/user/repo"
        className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-blue-500"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        onClick={handleIndex}
        disabled={isIndexing || !url.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        {isIndexing ? "Indexing..." : "Index Repository"}
      </button>
    </div>
  );
}
