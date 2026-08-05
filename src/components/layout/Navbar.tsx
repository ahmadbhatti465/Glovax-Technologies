"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, siteConfig } from "@/lib/constants";
import { Menu, X, ArrowUpRight, Calendar, MessageCircle } from "lucide-react";
import Image from "next/image";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { ChatWidget } from "@/components/chat/ChatWidget";

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
      className={`relative px-3.5 lg:px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
        active ? "text-accent" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="absolute inset-0 rounded-full border border-teal/25 bg-teal/[0.07] shadow-[inset_0_0_12px_var(--teal-glow)]"
        />
      )}
      <span className="relative z-10">{link.label}</span>
    </Link>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: watch any hash-link targets (e.g. #pricing) on the home page.
  useEffect(() => {
    setActiveHash(null);
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
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50">
        <div
          className={`transition-all duration-500 ${
            isScrolled
              ? "bg-background/80 backdrop-blur-2xl border-b border-neutral-border shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]"
              : "bg-transparent border-b border-transparent"
          }`}
        >
          {/* Subtle teal glow line */}
          <div
            className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-500 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--teal) 30%, transparent) 50%, transparent 100%)",
            }}
          />

          <nav className="max-w-7xl mx-auto px-5 md:px-8">
            <div
              className={`flex items-center justify-between transition-[height] duration-500 ease-out ${
                isScrolled ? "h-16 md:h-[4.25rem]" : "h-20 md:h-24"
              }`}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center group" aria-label="Glovax Technologies — home">
                <Image
                  src="/images/glovax-logo.png"
                  alt="Glovax Technologies"
                  width={161}
                  height={49}
                  priority
                  className={`w-auto transition-all duration-500 group-hover:drop-shadow-[0_0_10px_var(--teal-glow)] ${
                    isScrolled ? "h-7 md:h-9" : "h-8 md:h-10"
                  }`}
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-0.5">
                {navLinks.map((link) => {
                  const hash = getHashId(link.href);
                  const isActive = hash
                    ? pathname === "/" && activeHash === hash
                    : pathname === link.href;
                  return (
                    <NavLink key={link.href} link={link} active={isActive} onNavigate={closeMobile} />
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="hidden lg:block">
                <a
                  href="/contact"
                  aria-label="Book a call with Glovax Technologies"
                  className="group relative inline-flex items-center gap-2 pl-5 pr-2 py-1.5 text-sm font-semibold rounded-full overflow-hidden gradient-cta text-accent-foreground shadow-glow hover:shadow-glow-strong transition-shadow duration-300"
                >
                  <span className="relative z-10">Book a Call</span>
                  <span className="relative z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  {/* soft top sheen */}
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.28),transparent_65%)]" />
                </a>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="lg:hidden p-2 -mr-2 text-foreground hover:text-accent transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
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
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-2xl z-40 lg:hidden"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-section-alt border-l border-neutral-border z-50 lg:hidden flex flex-col"
            >
              {/* Teal top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--teal) 40%, transparent) 50%, transparent 100%)",
                }}
              />

              <div className="flex items-center justify-between h-20 px-6">
                <Image
                  src="/images/glovax-logo.png"
                  alt="Glovax Technologies"
                  width={138}
                  height={42}
                  className="h-8 w-auto"
                />
                <button
                  onClick={closeMobile}
                  className="p-2 text-foreground hover:text-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8">
                <nav className="space-y-1">
                  {navLinks.map((link, i) => {
                    const hash = getHashId(link.href);
                    const isActive = hash
                      ? pathname === "/" && activeHash === hash
                      : pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMobile}
                          className={`block py-3 text-2xl font-medium transition-colors ${
                            isActive ? "text-accent" : "text-foreground hover:text-accent"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div className="p-8 space-y-3">
                <a
                  href="/contact"
                  onClick={closeMobile}
                  className="group flex items-center justify-center gap-2 w-full px-6 py-4 text-base font-semibold rounded-full gradient-cta text-accent-foreground shadow-glow"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Call
                </a>
                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-base font-medium rounded-full border border-neutral-border text-foreground hover:border-teal/40 hover:text-accent transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Site-wide conversion CTAs (mobile bar + desktop WhatsApp float + AI concierge) */}
      <StickyMobileCTA />
      {/* <WhatsAppFloat /> */}
      <ChatWidget />
    </>
  );
}
