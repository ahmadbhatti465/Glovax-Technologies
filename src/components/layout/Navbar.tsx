"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, siteConfig } from "@/lib/constants";
import { Menu, X, ArrowUpRight, Calendar, MessageCircle, Mail, Search } from "lucide-react";
import Image from "next/image";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { CommandMenu, openCommandMenu } from "@/components/layout/CommandMenu";
import { cn } from "@/lib/utils";

/** Resolve whether a nav link is currently active:
 *  page links match the pathname; hash links ("/#pricing") light up when
 *  their target section scrolls into view on the home page. */
function getHashId(href: string): string | null {
  if (!href.includes("#")) return null;
  return href.split("#")[1] ?? null;
}

function NavLink({
  link,
  active,
  onNavigate,
}: {
  link: (typeof navLinks)[number];
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
        active ? "text-brand-textPrimary" : "text-brand-textSecondary hover:text-brand-textPrimary"
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          className="absolute inset-0 rounded-full border border-white/[0.08] bg-white/[0.05]"
        />
      )}
      <span className="relative z-10">{link.label}</span>
    </Link>
  );
}

const noopSubscribe = () => () => {};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const modKey = useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"),
    () => "Ctrl"
  );
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: watch any hash-link targets (e.g. #pricing) on the home page.
  // Stale hashes are harmless: isLinkActive only honours them on "/".
  useEffect(() => {
    const targets = navLinks
      .map((l) => getHashId(l.href))
      .filter(Boolean) as string[];

    const observers: IntersectionObserver[] = [];
    targets.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveHash(id);
              return;
            }
          }
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobile = () => setIsMobileMenuOpen(false);

  const isLinkActive = (href: string) => {
    const hash = getHashId(href);
    return hash ? pathname === "/" && activeHash === hash : pathname === href;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "border-b transition-[background-color,border-color,backdrop-filter] duration-300",
            isScrolled
              ? "border-white/[0.06] bg-canvas-base/70 backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-transparent"
          )}
        >
          <nav aria-label="Primary" className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex h-16 items-center justify-between gap-6">
              {/* Logo */}
              <Link href="/" className="flex shrink-0 items-center" aria-label="Glovax Technologies — home">
                <Image
                  src="/images/glovax-logo.png"
                  alt="Glovax Technologies"
                  width={161}
                  height={49}
                  priority
                  className="h-8 w-auto"
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-0.5 lg:flex">
                {navLinks.map((link) => (
                  <NavLink key={link.href} link={link} active={isLinkActive(link.href)} onNavigate={closeMobile} />
                ))}
              </div>

              {/* Actions */}
              <div className="hidden items-center gap-2 lg:flex">
                <button
                  type="button"
                  onClick={openCommandMenu}
                  aria-label="Search the site"
                  aria-keyshortcuts="Control+K Meta+K"
                  className="inline-flex h-9 items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] pl-3 pr-1.5 text-sm text-brand-textMuted transition-colors duration-200 hover:border-white/[0.14] hover:text-brand-textSecondary"
                >
                  <Search className="h-3.5 w-3.5" aria-hidden />
                  <span className="hidden xl:inline">Search</span>
                  <span className="flex items-center gap-0.5" aria-hidden>
                    <kbd className="kbd">{modKey}</kbd>
                    <kbd className="kbd">K</kbd>
                  </span>
                </button>
                <Link
                  href="/contact"
                  className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-accent-electric pl-4 pr-3 text-sm font-medium text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(37,99,235,0.6),0_6px_20px_-6px_rgba(37,99,235,0.7)] transition-colors duration-200 hover:bg-accent-electricBright"
                >
                  Book a call
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </Link>
              </div>

              {/* Mobile actions */}
              <div className="-mr-2 flex items-center gap-1 lg:hidden">
                <button
                  type="button"
                  onClick={openCommandMenu}
                  className="p-2 text-brand-textSecondary transition-colors hover:text-brand-textPrimary"
                  aria-label="Search the site"
                >
                  <Search className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen((v) => !v)}
                  className="p-2 text-brand-textPrimary transition-colors hover:text-accent-electricBright"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-canvas-base/80 backdrop-blur-xl lg:hidden"
              onClick={closeMobile}
            />
            <motion.div
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-sm flex-col border-l border-white/[0.06] bg-canvas-surface lg:hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-electricBright/50 to-transparent" />

              <div className="flex h-16 items-center justify-between px-6">
                <Image
                  src="/images/glovax-logo.png"
                  alt="Glovax Technologies"
                  width={138}
                  height={42}
                  className="h-8 w-auto"
                />
                <button
                  onClick={closeMobile}
                  className="p-2 text-brand-textPrimary transition-colors hover:text-accent-electricBright"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-center px-8">
                <nav aria-label="Mobile" className="space-y-1">
                  {navLinks.map((link, i) => {
                    const active = isLinkActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 + i * 0.04, duration: 0.3 }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMobile}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block py-2.5 text-2xl font-medium tracking-tight transition-colors",
                            active ? "text-brand-textPrimary" : "text-brand-textSecondary hover:text-brand-textPrimary"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 p-8">
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-electric px-6 py-3.5 text-base font-medium text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(37,99,235,0.6)]"
                >
                  <Calendar className="h-4 w-4" />
                  Book a call
                </Link>
                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.08] px-6 py-3.5 text-base font-medium text-brand-textPrimary transition-colors hover:bg-white/[0.04]"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp us
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  onClick={closeMobile}
                  className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm text-brand-textSecondary transition-colors hover:text-brand-textPrimary"
                >
                  <Mail className="h-4 w-4" />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CommandMenu />
      {/* Site-wide conversion CTAs (mobile bar + AI concierge) */}
      <StickyMobileCTA />
      <ChatWidget />
    </>
  );
}
