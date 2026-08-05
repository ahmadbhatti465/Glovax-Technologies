"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Lock,
  LayoutDashboard,
  Boxes,
  Users,
  Settings,
  TrendingUp,
  Zap,
  Sparkles,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";

/* ------------------------------------------------------------------
   Decorative AI-dashboard product preview for the hero. Pure HTML/CSS/
   SVG — no raster images, so it stays crisp on every screen and costs
   nothing at load. The mouse-parallax wrapper is GPU-friendly (spring
   transforms only) and disabled on touch via pointer-only handling.
   ------------------------------------------------------------------ */

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Boxes, label: "Projects", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const statCards = [
  { label: "AI Tasks", value: "8,912", delta: "+24%", up: true },
  { label: "Active Users", value: "12.4k", delta: "+9%", up: true },
  { label: "MRR", value: "$148k", delta: "+18%", up: true },
];

function Sparkline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 28"
      fill="none"
      aria-hidden
      className={`h-7 w-20 ${className}`}
    >
      <path
        d="M0 22 C12 18, 20 24, 30 17 C40 10, 48 15, 58 10 C66 6, 72 8, 80 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M0 22 C12 18, 20 24, 30 17 C40 10, 48 15, 58 10 C66 6, 72 8, 80 4 V28 H0 Z"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  );
}

function Chart() {
  const line = "M0 132 C55 118, 80 138, 135 104 C185 74, 215 118, 265 96 C315 74, 350 52, 400 62 C450 72, 480 34, 600 18";
  return (
    <svg viewBox="0 0 600 160" fill="none" aria-hidden className="w-full">
      <defs>
        <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="heroChartStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--teal-deep)" />
          <stop offset="100%" stopColor="var(--teal-bright)" />
        </linearGradient>
      </defs>

      {/* horizontal gridlines */}
      {[40, 80, 120].map((y) => (
        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="var(--neutral-border)" strokeOpacity="0.6" strokeDasharray="3 6" />
      ))}

      <motion.path
        d={`${line} V160 H0 Z`}
        fill="url(#heroChartFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.8 }}
      />
      <motion.path
        d={line}
        stroke="url(#heroChartStroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* end dot */}
      <motion.circle
        cx="600"
        cy="18"
        r="4"
        fill="var(--teal-bright)"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4, duration: 0.4 }}
        style={{ filter: "drop-shadow(0 0 6px var(--teal))" }}
      />
    </svg>
  );
}

function ChatBubble({ role, children }: { role: "user" | "ai"; children: React.ReactNode }) {
  const isAi = role === "ai";
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[11px] md:text-xs leading-relaxed ${
          isAi
            ? "bg-brand-bg-hi border border-neutral-border text-muted rounded-bl-md"
            : "gradient-cta text-accent-foreground rounded-br-md"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function HeroDashboardMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 140, damping: 22 });
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), { stiffness: 140, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mt-16 md:mt-24"
      style={{ perspective: 1400 }}
    >
      {/* soft ambient glow behind the mockup */}
      <div
        aria-hidden
        className="absolute -inset-x-8 -top-16 bottom-0 bg-[radial-gradient(60%_60%_at_50%_40%,var(--teal-glow),transparent_70%)] blur-3xl pointer-events-none"
      />
      {/* subtle animated mesh gradient — slow, calm, never distracting */}
      <div
        aria-hidden
        className="mesh-gradient absolute -inset-x-6 -top-10 bottom-0 blur-3xl opacity-70 pointer-events-none"
      />

      <motion.div
        style={{ x: tx, y: ty, rotateX: useTransform(my, [-0.5, 0.5], [3, -3]) }}
        className="relative"
      >
        {/* ===== Browser window ===== */}
        <div className="relative mx-auto max-w-5xl rounded-2xl md:rounded-[1.75rem] border border-neutral-border bg-brand-bg-raise/80 backdrop-blur-xl shadow-card-lg overflow-hidden">
          {/* chrome bar */}
          <div className="relative flex items-center gap-3 px-4 md:px-5 py-3 border-b border-neutral-border bg-brand-bg-hi/70">
            <div className="flex gap-1.5" aria-hidden>
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 flex justify-center min-w-0">
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-background/70 border border-neutral-border text-[11px] text-muted-foreground truncate">
                <Lock className="w-3 h-3 text-teal/70" />
                glovaxtechnologies.com
              </div>
            </div>
            <div className="w-14 hidden sm:flex justify-end gap-1.5 opacity-40" aria-hidden>
              <span className="w-3 h-3 rounded-sm border border-muted-foreground/60" />
              <span className="w-3 h-3 rounded-sm border border-muted-foreground/60" />
            </div>
          </div>

          {/* app body */}
          <div className="grid grid-cols-1 md:grid-cols-[170px_1fr]">
            {/* sidebar */}
            <div className="hidden md:flex flex-col gap-1 p-3.5 border-r border-neutral-border bg-background/40">
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    item.active
                      ? "bg-teal/[0.09] text-accent border border-teal/20"
                      : "text-muted-foreground border border-transparent"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </div>
              ))}
              <div className="mt-auto pt-3 border-t border-neutral-border">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-70" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  Systems live
                </div>
              </div>
            </div>

            {/* main panel */}
            <div className="p-4 md:p-6 space-y-4">
              {/* header row */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm md:text-base font-semibold tracking-tight">AI Revenue Dashboard</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">glovax · Q3 2026</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-[11px] font-medium text-accent">
                  <Sparkles className="w-3 h-3" />
                  AI Copilot
                </div>
              </div>

              {/* stat cards */}
              <div className="grid grid-cols-3 gap-2.5 md:gap-3">
                {statCards.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl md:rounded-2xl border border-neutral-border bg-brand-bg-hi/50 p-2.5 md:p-3.5"
                  >
                    <p className="text-[10px] md:text-[11px] text-muted-foreground truncate">{stat.label}</p>
                    <div className="flex items-baseline justify-between gap-1 mt-1">
                      <span className="text-sm md:text-lg font-bold tracking-tight">{stat.value}</span>
                      <span className="text-[10px] font-semibold text-success flex items-center gap-0.5">
                        <TrendingUp className="w-2.5 h-2.5" />
                        {stat.delta}
                      </span>
                    </div>
                    <Sparkline className="hidden md:block mt-1 text-teal/70" />
                  </div>
                ))}
              </div>

              {/* chart */}
              <div className="rounded-xl md:rounded-2xl border border-neutral-border bg-brand-bg-hi/50 p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-medium text-muted-foreground">Revenue growth</p>
                  <p className="text-[10px] text-muted-foreground/70">last 12 months</p>
                </div>
                <Chart />
              </div>

              {/* AI copilot chat */}
              <div className="rounded-xl md:rounded-2xl border border-neutral-border bg-brand-bg-hi/50 p-3 md:p-4 space-y-2.5">
                <ChatBubble role="user">Summarize Q3 revenue by region</ChatBubble>
                <ChatBubble role="ai">
                  <span className="inline-flex items-center gap-1.5 font-medium text-accent mb-1">
                    <Zap className="w-3 h-3" /> Copilot
                  </span>
                  <span className="block">
                    North America leads at $58k (+31% QoQ), EMEA follows at $44k, APAC grew fastest at +46%…
                  </span>
                </ChatBubble>
                <ChatBubble role="ai">
                  <span className="inline-flex items-center gap-1">
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-teal" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-teal" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-teal" />
                  </span>
                </ChatBubble>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Floating cards ===== */}
        <div className="absolute -top-6 right-2 md:-right-6 float-y z-10">
          <div className="flex items-center gap-3 rounded-2xl glass-strong shadow-card px-4 py-3">
            <div className="w-9 h-9 rounded-xl bg-success/10 border border-success/30 text-success flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight leading-none">+240%</p>
              <p className="text-[10px] text-muted-foreground mt-1">conversions</p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-5 left-2 md:-left-5 float-y-delay z-10">
          <div className="flex items-center gap-3 rounded-2xl glass-strong shadow-card px-4 py-3">
            <div className="w-9 h-9 rounded-xl bg-teal/10 border border-teal/30 text-accent flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight leading-none">1.2s</p>
              <p className="text-[10px] text-muted-foreground mt-1">AI response time</p>
            </div>
          </div>
        </div>

        <div className="absolute -top-3 left-2 md:-left-10 float-y-delay z-10 hidden sm:block">
          <div className="inline-flex items-center gap-1.5 rounded-full glass-strong shadow-card px-3.5 py-2 text-xs font-medium text-accent">
            <Sparkles className="w-3.5 h-3.5" />
            AI Copilot Active
          </div>
        </div>

        <div className="absolute -bottom-5 right-4 md:-right-8 float-y z-10 hidden sm:flex items-center gap-3 rounded-2xl glass-strong shadow-card px-4 py-3">
          <div className="flex -space-x-2.5" aria-hidden>
            {["SJ", "MC", "ER"].map((initials, i) => (
              <span
                key={initials}
                className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-semibold text-accent ${
                  i === 0 ? "bg-teal/15" : i === 1 ? "bg-azure/15 text-azure" : "bg-success/15 text-success"
                }`}
              >
                {initials}
              </span>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">30+ countries</p>
            <p className="text-[10px] text-muted-foreground mt-1">served worldwide</p>
          </div>
        </div>
      </motion.div>

      {/* floating action chip — CTA hint */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-surface-raised/90 backdrop-blur-xl shadow-glow px-4 py-2 text-xs font-medium text-muted">
          <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
          Built by the Glovax team
        </div>
      </div>
    </div>
  );
}
