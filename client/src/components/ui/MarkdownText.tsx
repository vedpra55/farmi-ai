"use client";

import React, { memo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownTextProps {
  content: string;
  className?: string;
}

const MarkdownText = memo(({ content, className }: MarkdownTextProps) => {
  const components: Components = {
    // Headings
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "mt-6 mb-4 text-2xl font-bold tracking-tight text-foreground",
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "mt-5 mb-3 text-xl font-semibold tracking-tight text-foreground",
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "mt-4 mb-2 text-lg font-semibold tracking-tight text-foreground",
          className,
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn(
          "mt-3 mb-1 text-base font-semibold tracking-tight text-foreground",
          className,
        )}
        {...props}
      />
    ),

    // Paragraphs & Text
    p: ({ className, ...props }) => (
      <p
        className={cn("mb-2 leading-7 text-foreground", className)}
        {...props}
      />
    ),
    strong: ({ className, ...props }) => (
      <strong
        className={cn("font-semibold text-foreground", className)}
        {...props}
      />
    ),
    em: ({ className, ...props }) => (
      <em
        className={cn("italic text-foreground-secondary", className)}
        {...props}
      />
    ),

    // Lists
    ul: ({ className, ...props }) => (
      <ul
        className={cn("my-2 ml-6 list-disc [&>li]:mt-1", className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn("my-2 ml-6 list-decimal [&>li]:mt-1", className)}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("text-foreground", className)} {...props} />
    ),

    // Blockquotes
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          "mt-4 mb-4 border-l-4 border-primary/50 bg-primary/5 pl-4 py-1 italic text-foreground-secondary",
          className,
        )}
        {...props}
      />
    ),

    // Code
    code: ({ className, inline, ...props }: any) => {
      const isInline = inline || !className;
      return isInline ? (
        <code
          className={cn(
            "relative rounded bg-surface-hover px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground",
            className,
          )}
          {...props}
        />
      ) : (
        <code
          className={cn(
            "relative font-mono text-sm text-foreground",
            className,
          )}
          {...props}
        />
      );
    },
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          "mb-4 mt-4 overflow-x-auto rounded-lg border border-border bg-surface p-4",
          className,
        )}
        {...props}
      />
    ),

    // Links
    a: ({ className, ...props }) => (
      <a
        className={cn(
          "font-medium text-primary underline underline-offset-4 hover:text-primary-hover",
          className,
        )}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),

    // Tables
    table: ({ className, ...props }) => (
      <div className="my-4 w-full overflow-y-auto rounded-lg border border-border">
        <table className={cn("w-full text-sm", className)} {...props} />
      </div>
    ),
    thead: ({ className, ...props }) => (
      <thead
        className={cn("bg-surface text-foreground", className)}
        {...props}
      />
    ),
    tbody: ({ className, ...props }) => (
      <tbody className={cn("divide-y divide-border", className)} {...props} />
    ),
    tr: ({ className, ...props }) => (
      <tr
        className={cn("transition-colors hover:bg-surface/50", className)}
        {...props}
      />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          "px-4 py-3 text-left font-medium text-foreground-muted [[align=center]]:text-center [[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          "px-4 py-3 text-left [[align=center]]:text-center [[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),

    // Horizontal Rule
    hr: ({ className, ...props }) => (
      <hr className={cn("my-6 border-border", className)} {...props} />
    ),
  };

  return (
    <div className={cn("w-full min-w-0", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownText.displayName = "MarkdownText";

export { MarkdownText };
