"use client";

import { useRef, useEffect } from "react";
import { type UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { MarkdownText } from "@/components/ui/MarkdownText";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ChatMessagesProps {
  messages: UIMessage[];
  status: string;
}

export function ChatMessages({ messages, status }: ChatMessagesProps) {
  const t = useTranslations("Assistant");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center ring-1 ring-border/50">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
          {t("emptyHeading")}
        </h2>
        <p className="text-foreground-muted max-w-sm leading-relaxed mb-8">
          {t("emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-0 md:pt-6 space-y-6 md:space-y-8 scroll-smooth">
      <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 px-0 md:px-4 pb-32">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex gap-4 md:gap-6",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {/* Avatar for Assistant */}

              <div
                className={cn(
                  "relative max-w-[85%] md:max-w-[75%]",
                  message.role === "user"
                    ? "bg-surface text-foreground px-5 py-3.5  rounded-lg "
                    : "text-foreground px-1 py-1",
                )}
              >
                {message.parts.map((part: any, index) => {
                  if (part.type === "text") {
                    return message.role === "assistant" ? (
                      <div key={index} className="text-[0.95rem] leading-7">
                        <MarkdownText content={part.text} />
                      </div>
                    ) : (
                      <p
                        key={index}
                        className="text-[0.95rem] leading-7 whitespace-pre-wrap"
                      >
                        {part.text}
                      </p>
                    );
                  }

                  // Check for both 'image' (custom/db) and 'file' (SDK standard)

                  if (part.type === "image" || part.type === "file") {
                    const imageUrl =
                      part.image ||
                      part.url ||
                      (typeof part.content === "string" ? part.content : "");

                    if (!imageUrl) return null;

                    return (
                      <div
                        key={index}
                        className="mb-2 rounded-lg overflow-hidden border border-border"
                      >
                        <img
                          src={imageUrl}
                          alt="Uploaded attachment"
                          className="max-w-full h-auto max-h-[300px] object-contain bg-muted"
                        />
                      </div>
                    );
                  }

                  return null;
                })}

                {/* Message Actions (Assistant Only) */}
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 rounded-md hover:bg-surface text-foreground-muted hover:text-foreground transition-colors"
                      title={t("copy")}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-md hover:bg-surface text-foreground-muted hover:text-foreground transition-colors"
                      title={t("helpful")}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-md hover:bg-surface text-foreground-muted hover:text-foreground transition-colors"
                      title={t("notHelpful")}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming/Loading indicator */}
        {(status === "submitted" || status === "streaming") && (
          <span className="text-sm text-foreground-muted animate-pulse font-medium">
            Thinking...
          </span>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
