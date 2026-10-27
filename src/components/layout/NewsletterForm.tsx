"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

/** Newsletter signup — delivered to the owner inbox via the lead endpoint. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: "Newsletter signup (footer)" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("You're subscribed. Talk soon.");
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center gap-1.5 rounded-full border border-white/[0.08] bg-canvas-surface p-1 pl-4 transition-[border-color,box-shadow] duration-300 focus-within:border-accent-electricBright/60 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.15)]"
    >
      <input
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Email address"
        disabled={sending}
        className="min-w-0 flex-1 bg-transparent text-sm text-brand-textPrimary placeholder:text-brand-textMuted outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={sending}
        aria-label="Subscribe"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-textPrimary text-canvas-base transition-colors hover:bg-white disabled:opacity-70"
      >
        {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
      </button>
    </form>
  );
}
