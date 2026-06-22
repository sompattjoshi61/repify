"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import ChatWindow from "@/components/ChatWindow";
import RepoInput from "@/components/RepoInput";
import DiagramUpload from "@/components/DiagramUpload";

export default function Dashboard() {
  const [indexedRepo, setIndexedRepo] = useState<string | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);

  const handleRepoIndexed = (repoUrl: string) => {
    setIndexedRepo(repoUrl);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-xl">Repify</span>
          <span className="text-gray-500 text-sm">Ask your codebase anything</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-800 bg-gray-900 p-4 flex flex-col gap-6">
          <RepoInput onIndexed={handleRepoIndexed} isIndexing={isIndexing} setIsIndexing={setIsIndexing} />
          <DiagramUpload indexedRepo={indexedRepo} />

          {indexedRepo && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
              <p className="text-green-400 text-xs font-medium mb-1">Indexed Repository</p>
              <p className="text-green-300 text-xs break-all">{indexedRepo}</p>
            </div>
          )}
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col">
          <ChatWindow indexedRepo={indexedRepo} />
        </main>
      </div>
    </div>
  );
}
