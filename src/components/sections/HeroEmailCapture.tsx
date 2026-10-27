"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/lib/constants";

export function HeroEmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message: "Hero early-access / free-estimate request",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Thanks! We'll be in touch within 24 hours.");
        setEmail("");
        setStatus("done");
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
        setStatus("idle");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  const sending = status === "sending";

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="group relative flex items-center gap-2 rounded-full border border-white/[0.08] bg-canvas-surface/80 p-1.5 pl-5 backdrop-blur-md transition-[border-color,box-shadow] duration-300 focus-within:border-accent-electricBright/60 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.15)] hover:border-white/[0.14]"
      >
        <label htmlFor="hero-email" className="sr-only">
          Work email for a free estimate
        </label>
        <input
          id="hero-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          disabled={sending}
          className="min-w-0 flex-1 bg-transparent text-sm text-brand-textPrimary placeholder:text-brand-textMuted outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-brand-textPrimary px-4 text-sm font-medium text-canvas-base transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.97] disabled:opacity-70"
        >
          {sending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <>
              Free estimate
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-focus-within:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
      </form>
      <p className="mt-3 text-xs text-brand-textMuted" aria-live="polite">
        {status === "done"
          ? "Received — check your inbox shortly."
          : `No obligation. We reply within ${siteConfig.responseTime}.`}
      </p>
    </div>
  );
}
