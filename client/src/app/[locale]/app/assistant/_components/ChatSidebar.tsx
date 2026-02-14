"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { format, isToday, isYesterday, subDays } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "@/lib/axios";
import { useTranslations } from "next-intl";

interface Conversation {
  _id: string;
  title: string;
  updatedAt: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export function ChatSidebar({
  isOpen,
  onClose,
  currentConversationId,
  onSelectConversation,
  onNewChat,
}: ChatSidebarProps) {
  const t = useTranslations("Assistant");
  const { getToken } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      console.log(
        "Fetching conversations from:",
        `${serverUrl}/api/assistant/conversations`,
      );
      const token = await getToken();
      console.log("Token present:", !!token);

      const res = await axios.get(`${serverUrl}/api/assistant/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Conversations response:", res);

      // @ts-ignore - Interceptor returns data directly
      if (res.success) {
        // @ts-ignore
        console.log("Setting conversations:", res.data);
        // @ts-ignore
        setConversations(res.data);
      } else {
        console.warn("API returned success: false");
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("ChatSidebar mounted, fetching conversations...");
    fetchConversations();
  }, [isOpen]); // Keeping isOpen dependency for now, but logged to see what happens

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      await axios.delete(`${serverUrl}/api/assistant/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (currentConversationId === id) {
        onNewChat();
      }
    } catch (error) {
      console.error("Failed to delete conversation", error);
    }
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce(
    (acc, conversation) => {
      const date = new Date(conversation.updatedAt);
      if (isToday(date)) {
        acc.today.push(conversation);
      } else if (isYesterday(date)) {
        acc.yesterday.push(conversation);
      } else if (date > subDays(new Date(), 7)) {
        acc.last7Days.push(conversation);
      } else {
        acc.older.push(conversation);
      }
      return acc;
    },
    {
      today: [] as Conversation[],
      yesterday: [] as Conversation[],
      last7Days: [] as Conversation[],
      older: [] as Conversation[],
    },
  );

  console.log(
    "ChatSidebar Render - isLoading:",
    isLoading,
    "conversations:",
    conversations.length,
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-surface-hover text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("newChat")}
          </button>
          <button
            onClick={onClose}
            className="md:hidden p-2 text-foreground-muted hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-skeleton rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-sm text-foreground-muted py-8">
              {t("noConversations")}
            </div>
          ) : (
            <>
              {Object.entries(groupedConversations).map(([key, list]) => {
                if (list.length === 0) return null;
                const label =
                  key === "today"
                    ? t("historyGroups.today")
                    : key === "yesterday"
                      ? t("historyGroups.yesterday")
                      : key === "last7Days"
                        ? t("historyGroups.last7Days")
                        : t("historyGroups.older");

                return (
                  <div key={key}>
                    <h3 className="text-xs font-semibold text-foreground-muted uppercase mb-2 px-2">
                      {label}
                    </h3>
                    <div className="space-y-1">
                      {list.map((conversation) => (
                        <button
                          key={conversation._id}
                          onClick={() => {
                            onSelectConversation(conversation._id);
                            if (window.innerWidth < 768) onClose();
                          }}
                          className={cn(
                            "group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors relative",
                            currentConversationId === conversation._id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground-secondary hover:bg-surface-hover",
                          )}
                        >
                          <MessageSquare className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1">
                            {conversation.title}
                          </span>

                          <div
                            className={cn(
                              "opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-linear-to-l from-surface-hover to-transparent pl-4",
                              currentConversationId === conversation._id
                                ? "bg-linear-to-l from-primary/10"
                                : "",
                            )}
                          >
                            <div
                              role="button"
                              onClick={(e) => handleDelete(e, conversation._id)}
                              className="p-1.5 rounded-md hover:bg-danger/10 hover:text-danger text-foreground-muted/50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
