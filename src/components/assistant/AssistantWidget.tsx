"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageSquare,
  X,
  ArrowUp,
  Sparkles,
  Loader2,
  RotateCcw,
} from "lucide-react";
import {
  SUGGESTIONS,
  filterSuggestions,
  type Suggestion,
} from "@/lib/assistant/suggestions";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING =
  "Hi - I'm Mani's assistant. Ask me about his work, projects, notelogs or interview-prep topics, and I'll point you to the right place.";

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const typeahead = filterSuggestions(input);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setError(
          res.status === 429
            ? "You're sending messages a bit fast - give it a moment and try again."
            : data?.error || "Something went wrong. Please try again."
        );
        setBusy(false);
        return;
      }

      // Stream tokens into a single growing assistant message.
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onSuggestion(s: Suggestion) {
    send(s.prompt);
  }

  function resetChat() {
    if (busy) return; // don't wipe a message that's still streaming in
    setMessages([]);
    setInput("");
    setError(null);
    inputRef.current?.focus();
  }

  const showChips = messages.length === 0;

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-6 right-6 z-60 flex h-14 w-14 items-center justify-center border border-white/10 bg-black text-white shadow-2xl transition-all duration-500 hover:border-accent hover:text-accent"
      >
        {open ? <X size={20} /> : <MessageSquare size={20} />}
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-60 flex h-[min(70vh,560px)] w-[min(92vw,400px)] flex-col border border-white/10 bg-black shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                Mani&apos;s Assistant
              </span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={resetChat}
                  disabled={busy}
                  aria-label="Start a new conversation"
                  title="Start a new conversation"
                  className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 transition-colors hover:text-accent disabled:opacity-30"
                >
                  <RotateCcw size={12} />
                  New
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-foreground/40 transition-colors hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {showChips && (
              <div className="space-y-5">
                <p className="text-sm font-light leading-relaxed text-foreground/60">
                  {GREETING}
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => onSuggestion(s)}
                      className="border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 transition-all duration-300 hover:border-accent hover:text-accent"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} onNavigate={() => setOpen(false)} />
            ))}

            {busy && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-center gap-2 text-foreground/40">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-[10px] uppercase tracking-[0.3em]">thinking…</span>
              </div>
            )}

            {error && (
              <p className="border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400/80">
                {error}
              </p>
            )}
          </div>

          {/* Type-ahead suggestions */}
          {typeahead.length > 0 && (
            <div className="border-t border-white/5 px-3 pt-2">
              <div className="flex flex-wrap gap-1.5 pb-2">
                {typeahead.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => onSuggestion(s)}
                    className="flex items-center gap-1 border border-white/10 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-foreground/50 transition-all hover:border-accent hover:text-accent"
                  >
                    <Sparkles size={9} className="text-accent" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-white/5 p-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={1000}
              placeholder="Ask about Mani…"
              className="max-h-28 flex-1 resize-none bg-transparent px-2 py-2 text-sm font-light text-white placeholder:text-foreground/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white transition-all hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowUp size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({
  role,
  content,
  onNavigate,
}: {
  role: "user" | "assistant";
  content: string;
  onNavigate: () => void;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] border border-white/10 bg-white/5 px-3 py-2 text-sm font-light text-white">
          {content}
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-[92%] text-sm font-light leading-relaxed text-foreground/80">
      <div className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline prose-li:my-0.5 prose-strong:text-white prose-strong:font-bold">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a({ href, children }) {
              const url = href || "";
              // Internal link → in-app navigation, closes the widget on click.
              if (url.startsWith("/")) {
                return (
                  <Link
                    href={url}
                    onClick={onNavigate}
                    className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
                  >
                    {children}
                  </Link>
                );
              }
              // External (only the owner's own socials reach here) → new tab,
              // never navigates the visitor away from the site.
              if (/^https?:\/\//.test(url) || url.startsWith("mailto:")) {
                return (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent underline decoration-accent/30 underline-offset-2"
                  >
                    {children}
                  </a>
                );
              }
              // Anything else → render as plain text (no navigation).
              return <span>{children}</span>;
            },
          }}
        >
          {content || "…"}
        </ReactMarkdown>
      </div>
    </div>
  );
}
