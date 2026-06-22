"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import ChatWindow from "@/components/ChatWindow";
import RepoInput from "@/components/RepoInput";
import DiagramUpload from "@/components/DiagramUpload";

export default function Dashboard() {
  const [indexedRepo, setIndexedRepo] = useState<string | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Navbar */}
      <nav style={{ borderBottom: "1px solid #333", backgroundColor: "#0a0a0a" }} className="px-6 py-3 flex items-center justify-between">
        <a href="/" className="font-bold tracking-widest uppercase text-sm text-white hover:opacity-70 transition-opacity">REPIFY</a>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside style={{ width: "280px", borderRight: "1px solid #333", backgroundColor: "#0d0d0d" }} className="flex flex-col gap-6 p-5 overflow-y-auto shrink-0">
          <RepoInput onIndexed={setIndexedRepo} isIndexing={isIndexing} setIsIndexing={setIsIndexing} />
          <div style={{ borderTop: "1px solid #2a2a2a" }} />
          <DiagramUpload indexedRepo={indexedRepo} />

          {indexedRepo && (
            <div style={{ border: "1px solid #2a2a2a", backgroundColor: "#111" }} className="p-3 mt-auto">
              <p style={{ color: "#555", fontSize: "10px", letterSpacing: "0.1em" }} className="uppercase mb-1">Indexed</p>
              <p style={{ color: "#aaa", fontSize: "11px", wordBreak: "break-all", lineHeight: "1.6" }}>{indexedRepo}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span style={{ width: "6px", height: "6px", backgroundColor: "white", borderRadius: "50%", display: "inline-block" }} />
                <span style={{ fontSize: "10px", color: "white" }}>Ready</span>
              </div>
            </div>
          )}
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#000" }}>
          <ChatWindow indexedRepo={indexedRepo} />
        </main>
      </div>
    </div>
  );
}
