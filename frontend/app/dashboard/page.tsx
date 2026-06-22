"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import ChatWindow from "@/components/ChatWindow";
import RepoInput from "@/components/RepoInput";
import DiagramUpload from "@/components/DiagramUpload";
import RecentChats from "@/components/RecentChats";
import { Conversation, Message } from "@/lib/supabase";

export default function Dashboard() {
  const { user } = useUser();
  const [indexedRepo, setIndexedRepo] = useState<string | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRestore = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
    setInitialMessages(conversation.messages);
    if (conversation.repo_url) setIndexedRepo(conversation.repo_url);
  };

  const handleNewMessage = () => {
    setRefreshTrigger((n) => n + 1);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Navbar */}
      <nav style={{ borderBottom: "1px solid #333", backgroundColor: "#0a0a0a" }} className="px-6 py-3 flex items-center justify-between">
        <a href="/" style={{ fontWeight: "bold", letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "14px", color: "white", textDecoration: "none" }}
          onMouseEnter={e => ((e.target as HTMLAnchorElement).style.opacity = "0.7")}
          onMouseLeave={e => ((e.target as HTMLAnchorElement).style.opacity = "1")}
        >
          REPIFY
        </a>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside style={{ width: "280px", borderRight: "1px solid #333", backgroundColor: "#0d0d0d", display: "flex", flexDirection: "column", gap: "20px", padding: "20px", overflowY: "auto", flexShrink: 0 }}>
          <RepoInput onIndexed={setIndexedRepo} isIndexing={isIndexing} setIsIndexing={setIsIndexing} />

          <div style={{ borderTop: "1px solid #2a2a2a" }} />

          <DiagramUpload indexedRepo={indexedRepo} />

          {indexedRepo && (
            <div style={{ border: "1px solid #2a2a2a", backgroundColor: "#111", padding: "10px 12px" }}>
              <p style={{ color: "#555", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Indexed</p>
              <p style={{ color: "#aaa", fontSize: "11px", wordBreak: "break-all", lineHeight: "1.6" }}>{indexedRepo}</p>
              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", backgroundColor: "white", borderRadius: "50%", display: "inline-block" }} />
                <span style={{ fontSize: "10px", color: "white" }}>Ready</span>
              </div>
            </div>
          )}

          <div style={{ borderTop: "1px solid #2a2a2a" }} />

          <RecentChats
            userId={user.id}
            onRestore={handleRestore}
            activeId={activeConversationId}
            refreshTrigger={refreshTrigger}
          />
        </aside>

        {/* Chat area */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#000" }}>
          <ChatWindow
            indexedRepo={indexedRepo}
            userId={user.id}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
            initialMessages={initialMessages}
            onNewMessage={handleNewMessage}
          />
        </main>
      </div>
    </div>
  );
}
