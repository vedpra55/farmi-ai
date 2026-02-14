"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Mic, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ChatInputProps {
  onSend: (text: string, attachments?: FileList) => void;
  disabled: boolean;
  onVoiceToggle: () => void;
  isVoiceActive: boolean;
}

export function ChatInput({
  onSend,
  disabled,
  onVoiceToggle,
  isVoiceActive,
}: ChatInputProps) {
  const t = useTranslations("Assistant");
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [previews, setPreviews] = useState<string[]>([]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);

      // Create previews
      const newPreviews: string[] = [];
      Array.from(e.target.files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result as string);
            if (newPreviews.length === e.target.files!.length) {
              setPreviews(newPreviews);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const clearFiles = () => {
    setFiles(undefined);
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || files) && !disabled) {
      onSend(input.trim(), files);
      setInput("");
      clearFiles();
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full p-4 bg-linear-to-t from-background via-background/80 to-transparent pb-6 md:pb-8">
      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="max-w-3xl mx-auto mb-2 flex gap-2 overflow-x-auto py-2 px-1">
          {previews.map((preview: string, index: number) => (
            <div key={index} className="relative group shrink-0">
              <img
                src={preview}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-xl border border-border bg-surface shadow-sm"
              />
              <button
                type="button"
                onClick={clearFiles}
                className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 text-foreground-muted hover:text-destructive shadow-sm transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto relative group">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 p-2 rounded-[26px] bg-surface/80 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
            multiple
          />

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 p-3 rounded-full text-foreground-muted hover:bg-background/50 hover:text-foreground transition-all duration-200"
            title={t("attach")}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={t("placeholder")}
            rows={1}
            className="w-full max-h-[200px] bg-transparent border-0 px-2 py-3 text-base text-foreground placeholder:text-foreground-muted/70 focus:ring-0 resize-none min-h-[44px]"
          />

          {/* Voice Button */}
          <button
            type="button"
            onClick={onVoiceToggle}
            className={cn(
              "shrink-0 p-3 rounded-full transition-all duration-200",
              isVoiceActive
                ? "bg-accent text-accent-foreground animate-pulse"
                : "text-foreground-muted hover:bg-background/50 hover:text-foreground",
            )}
            title={t("voiceMode")}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={disabled || (!input.trim() && !files)}
            className="shrink-0 p-2 m-1 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </form>
      </div>
      <div className="text-center mt-3">
        <p className="text-[10px] text-foreground-muted/70">
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}
