"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  Copy,
  CornerDownLeft,
  FileText,
  Home,
  Layers,
  Mail,
  MessageCircle,
  Search,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { services } from "@/data/services";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Command = {
  id: string;
  label: string;
  group: "Pages" | "Services" | "Contact";
  icon: LucideIcon;
  keywords?: string;
  run: (router: ReturnType<typeof useRouter>) => void;
};

const go = (href: string) => (router: ReturnType<typeof useRouter>) => router.push(href);
const open = (href: string) => () => window.open(href, "_blank", "noopener,noreferrer");

const commands: Command[] = [
  { id: "home", label: "Home", group: "Pages", icon: Home, run: go("/") },
  { id: "services", label: "Services", group: "Pages", icon: Layers, run: go("/services") },
  { id: "work", label: "Work & case studies", group: "Pages", icon: Briefcase, keywords: "portfolio projects", run: go("/work") },
  { id: "pricing", label: "Pricing", group: "Pages", icon: Tag, keywords: "cost plans", run: go("/#pricing") },
  { id: "about", label: "About", group: "Pages", icon: Users, keywords: "team company", run: go("/about") },
  { id: "blog", label: "Blog", group: "Pages", icon: BookOpen, keywords: "articles insights", run: go("/blog") },
  { id: "career", label: "Careers", group: "Pages", icon: FileText, keywords: "jobs hiring", run: go("/career") },
  ...services.map<Command>((s) => ({
    id: `service-${s.id}`,
    label: s.title,
    group: "Services",
    icon: ArrowRight,
    keywords: s.features.join(" "),
    run: go("/services"),
  })),
  { id: "book", label: "Book a free call", group: "Contact", icon: Calendar, keywords: "meeting calendly", run: open(siteConfig.calendarUrl) },
  { id: "contact", label: "Contact form", group: "Contact", icon: Mail, run: go("/contact") },
  { id: "whatsapp", label: "Chat on WhatsApp", group: "Contact", icon: MessageCircle, run: open(siteConfig.social.whatsapp) },
  {
    id: "copy-email",
    label: `Copy email — ${siteConfig.email}`,
    group: "Contact",
    icon: Copy,
    run: () => {
      navigator.clipboard
        .writeText(siteConfig.email)
        .then(() => toast.success("Email copied to clipboard"))
        .catch(() => toast.error("Couldn't copy — " + siteConfig.email));
    },
  },
];

const OPEN_EVENT = "glovax:command-menu";

/** Open the command menu from anywhere (e.g. a navbar button). */
export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CommandMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    restoreFocus.current?.focus?.();
  }, []);

  // Reset the query whenever visibility changes so the menu always opens fresh.
  const toggle = useCallback((next?: boolean) => {
    setIsOpen((v) => next ?? !v);
    setQuery("");
    setActive(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    const onOpen = () => toggle(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [toggle]);

  useEffect(() => {
    if (!isOpen) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runCommand = (cmd: Command | undefined) => {
    if (!cmd) return;
    setIsOpen(false);
    cmd.run(router);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
      <div
        aria-hidden
        className="absolute inset-0 bg-canvas-base/70 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-canvas-surface shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
          <Search className="h-4 w-4 shrink-0 text-brand-textMuted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search pages, services, or actions…"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-menu-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            className="h-14 flex-1 bg-transparent text-[0.9375rem] text-brand-textPrimary placeholder:text-brand-textMuted outline-none"
          />
          <kbd className="kbd">esc</kbd>
        </div>

        <ul
          ref={listRef}
          id="command-menu-list"
          role="listbox"
          className="max-h-[min(60vh,420px)] overflow-y-auto p-2 no-scrollbar"
        >
          {results.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-brand-textMuted">No results for “{query}”</li>
          )}
          {results.map((cmd, i) => {
            const header = results[i - 1]?.group !== cmd.group ? cmd.group : null;
            const selected = i === active;
            return (
              <li key={cmd.id} role="presentation">
                {header && (
                  <div className="px-3 pt-3 pb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-textMuted">
                    {header}
                  </div>
                )}
                <div
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={selected}
                  data-index={i}
                  onPointerMove={() => !selected && setActive(i)}
                  onClick={() => runCommand(cmd)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-100",
                    selected ? "bg-canvas-elevated text-brand-textPrimary" : "text-brand-textSecondary"
                  )}
                >
                  <cmd.icon
                    className={cn("h-4 w-4 shrink-0", selected ? "text-accent-electricBright" : "text-brand-textMuted")}
                    aria-hidden
                  />
                  <span className="flex-1 truncate">{cmd.label}</span>
                  {selected && <CornerDownLeft className="h-3.5 w-3.5 text-brand-textMuted" aria-hidden />}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-[11px] text-brand-textMuted">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd>
            to navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="kbd">↵</kbd>
            to select
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
