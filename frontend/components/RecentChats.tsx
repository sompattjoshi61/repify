"use client";

import { useEffect, useState } from "react";
import { fetchConversations, deleteConversation, Conversation, Message } from "@/lib/supabase";

interface Props {
  userId: string;
  onRestore: (conversation: Conversation) => void;
  activeId: string | null;
  refreshTrigger: number;
}

export default function RecentChats({ userId, onRestore, activeId, refreshTrigger }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchConversations(userId);
    setConversations(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [userId, refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'JetBrains Mono', monospace" }}>
      <p style={{ color: "#ffffff", fontSize: "11px", letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" }}>
        Recent Chats
      </p>

      {loading && (
        <p style={{ color: "#555", fontSize: "11px" }}>Loading...</p>
      )}

      {!loading && conversations.length === 0 && (
        <p style={{ color: "#555", fontSize: "11px" }}>No conversations yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onRestore(conv)}
            style={{
              border: `1px solid ${activeId === conv.id ? "#666" : "#2a2a2a"}`,
              backgroundColor: activeId === conv.id ? "#111" : "transparent",
              padding: "8px 10px",
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "6px",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#555")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = activeId === conv.id ? "#666" : "#2a2a2a")}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: "#dddddd",
                fontSize: "11px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: "2px",
              }}>
                {conv.title}
              </p>
              <p style={{ color: "#555", fontSize: "10px" }}>{formatTime(conv.created_at)}</p>
            </div>
            <button
              onClick={(e) => handleDelete(e, conv.id)}
              style={{
                color: "#444",
                fontSize: "14px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 2px",
                lineHeight: 1,
                flexShrink: 0,
              }}
              onMouseEnter={e => ((e.target as HTMLButtonElement).style.color = "#ff6b6b")}
              onMouseLeave={e => ((e.target as HTMLButtonElement).style.color = "#444")}
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
