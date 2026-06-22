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
      setError("Failed to upload diagram.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-white font-semibold text-sm">Upload Architecture Diagram</h2>
      <label className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-lg p-4 text-center cursor-pointer transition-colors">
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        {uploading ? (
          <p className="text-gray-400 text-xs">Uploading...</p>
        ) : uploaded ? (
          <p className="text-green-400 text-xs">Diagram indexed!</p>
        ) : (
          <>
            <p className="text-gray-400 text-xs">Click to upload PNG/JPG</p>
            <p className="text-gray-600 text-xs mt-1">Architecture diagrams, ER diagrams</p>
          </>
        )}
      </label>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
