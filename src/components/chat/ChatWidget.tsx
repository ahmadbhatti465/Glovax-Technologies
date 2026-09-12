"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Mail } from "lucide-react";
import { getChatAnswer, findEmail, QUICK_REPLIES } from "@/lib/chat-concierge";
import { siteConfig } from "@/lib/constants";

interface Msg {
  role: "user" | "bot";
  content: string;
}

// Set NEXT_PUBLIC_CHAT_ENABLED=false (and rebuild) to hide the concierge entirely.
const ENABLED = process.env.NEXT_PUBLIC_CHAT_ENABLED !== "false";

const LEAD_HINT = /contact me|email me|call me|callback|get back|reach (me|out)|my email|book a call/i;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      const greet = getChatAnswer("hi");
      setMessages([{ role: "bot", content: greet.text }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  if (!ENABLED) return null;

  async function submitLead(email: string, extra: string) {
    try {
      await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: extra }),
      });
    } catch {
      // lead capture is best-effort; never break the chat
    }
  }

  function send(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTyping(true);

    // Lead-confirmation flow: user just replied to our "want us to reach out?" prompt
    if (pendingEmail) {
      const email = pendingEmail;
      setPendingEmail(null);
      void submitLead(email, text);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            content:
              "Thanks! Our team will reach out within 24 hours. Meanwhile, you can also reach us through our contact page: " +
              `${siteConfig.url}/contact`,
          },
        ]);
      }, 700);
      return;
    }

    const email = findEmail(text);
    const wantsContact = LEAD_HINT.test(text);

    setTimeout(() => {
      setTyping(false);
      if (email && wantsContact) {
        setPendingEmail(email);
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            content: `I've noted ${email} — want our team to reach out? Reply "yes" and I'll send it through. Or reach us on our contact page: ${siteConfig.url}/contact`,
          },
        ]);
      } else {
        const reply = getChatAnswer(text);
        setMessages((m) => [...m, { role: "bot", content: reply.text }]);
      }
    }, 700);
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-24 lg:bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-teal-deep to-teal text-accent-foreground flex items-center justify-center shadow-[0_0_25px_var(--teal-muted)] hover:brightness-110 transition-all"
        aria-label={open ? "Close chat" : "Open chat with the Glovax concierge"}
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-36 lg:bottom-24 left-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] h-[480px] max-h-[70vh] rounded-2xl bg-surface-raised border border-neutral-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center text-teal">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">Glovax Concierge</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" /> Online · replies instantly
                  </p>
                </div>
              </div>
              <a
                href={`mailto:${siteConfig.email}`}
                title={`Email ${siteConfig.email}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors px-2 py-1 rounded-md hover:bg-surface-raised border border-transparent hover:border-neutral-border"
              >
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-medium hidden sm:inline">Email Us</span>
              </a>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-gradient-to-r from-teal-deep to-teal text-accent-foreground text-sm leading-relaxed"
                        : "max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-md bg-card border border-neutral-border text-foreground/90 text-sm leading-relaxed"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-card border border-neutral-border flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:240ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.label}
                    onClick={() => send(qr.message)}
                    className="px-3 py-1.5 rounded-full text-xs bg-card border border-neutral-border text-muted-foreground hover:text-teal hover:border-teal/40 transition-colors"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="px-4 py-3 border-t border-neutral-border flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, services, NDAs…"
                className="flex-1 px-4 py-2.5 rounded-full bg-card border border-neutral-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal/40 transition-colors"
              />
              <button
                type="submit"
                disabled={typing || !input.trim()}
                className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-r from-teal-deep to-teal text-accent-foreground flex items-center justify-center disabled:opacity-40 transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
