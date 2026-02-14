"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAuth } from "@clerk/nextjs";
import { ChatMessages } from "./_components/ChatMessages";
import { ChatInput } from "./_components/ChatInput";
import { VoiceMode } from "./_components/VoiceMode";
import { ChatSidebar } from "./_components/ChatSidebar";
import { ArrowLeft, Mic, Menu, PlusSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import axios from "@/lib/axios";
import { useTranslations, useLocale } from "next-intl";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export default function AssistantPage() {
  const t = useTranslations("Assistant");
  const { getToken } = useAuth();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    // Enable saving to a specific conversation if ID exists
    transport: new DefaultChatTransport({
      api: `${serverUrl}/api/assistant/chat`,
      headers: async () => {
        const token = await getToken();
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
    onFinish: () => {
      // Refresh sidebar list if it's a new conversation (could be optimized)
      // For now we just let it be, user will see it on refresh or if we trigger an update
    },
  });

  // Load conversation when selected
  const handleSelectConversation = async (id: string) => {
    try {
      setConversationId(id);
      setIsSidebarOpen(false); // Close sidebar on mobile

      const token = await getToken();
      const res = await axios.get(
        `${serverUrl}/api/assistant/conversations/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // @ts-ignore - Interceptor returns data directly
      if (res.success) {
        // Map backend messages to UI messages if needed, or pass directly if strictly compatible
        // The backend stores 'parts', ai-sdk uses 'parts' or 'content'.
        // @ts-ignore
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Failed to load conversation", error);
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const locale = useLocale();

  const handleSend = (text: string, files?: FileList) => {
    if (text.trim() || files) {
      sendMessage(
        {
          text,
          files,
        },
        { body: { conversationId, locale } },
      );
    }
  };

  return (
    <div className="flex h-screen md:h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 md:px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 -ml-2 text-foreground-muted hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              href="/app"
              className="hidden md:flex p-1.5 rounded-lg hover:bg-surface transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground-muted" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                {status === "submitted" || status === "streaming" ? (
                  <span className="animate-pulse text-primary flex items-center gap-2">
                    Thinking...
                  </span>
                ) : (
                  <>
                    {t("title")}
                    <span className="text-xs font-normal text-foreground-muted px-2 py-0.5 rounded-full bg-surface border border-border">
                      {t("beta")}
                    </span>
                  </>
                )}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="md:hidden p-2 text-foreground-muted hover:text-foreground"
              title={t("newChat")}
            >
              <PlusSquare className="w-5 h-5" />
            </button>

            {/* Voice mode toggle */}
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground border transition-all text-sm font-medium"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">{t("voiceMode")}</span>
            </button>
          </div>
        </header>

        {/* Chat messages area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <ChatMessages messages={messages} status={status} />

          {/* Input area */}
          <div className="shrink-0 z-20">
            <ChatInput
              onSend={handleSend}
              disabled={status !== "ready" && status !== "error"}
              onVoiceToggle={() => setIsVoiceOpen(true)}
              isVoiceActive={isVoiceOpen}
            />
          </div>
        </div>
      </div>

      {/* Voice mode overlay */}
      <VoiceMode isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
}
