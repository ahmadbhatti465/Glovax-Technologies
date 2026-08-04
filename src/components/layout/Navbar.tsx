"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/lib/constants";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ChatWidget } from "@/components/chat/ChatWidget";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <>
      <header
        className={`fixed top-0  left-0 right-0 z-50 ${
          isScrolled
            ? "bg-background/70 backdrop-blur-2xl border-b border-neutral-border"
            : "bg-transparent"
        }`}
      >
        {/* Subtle teal glow line on scroll */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--teal) 30%, transparent) 50%, transparent 100%)",
          }}
        />

        <nav className="max-w-7xl mx-auto px-6   md:px-8">
          <div
            className={`flex items-center justify-between ${
              isScrolled ? "h-20" : "h-28"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/glovax-logo.svg"
                alt="Glovax Technologies"
                width={140}
                height={49}
                className={`w-auto group-hover:drop-shadow-[0_0_8px_var(--teal-glow)] ${
                  isScrolled ? "h-8 md:h-10" : "h-9 md:h-11"
                }`}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex  items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full ${
                      isActive
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    } hover:bg-teal/5`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full border border-accent/20 bg-accent/5" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <a
                href={siteConfig.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book a call with Glovax Technologies (opens in a new tab)"
                className="relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-deep to-teal group-hover:brightness-110" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                <span className="relative z-10 text-accent-foreground">Book a Call</span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:text-accent"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/90 backdrop-blur-2xl z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-section-alt border-l border-neutral-border z-50 lg:hidden flex flex-col">
              {/* Teal top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--teal) 40%, transparent) 50%, transparent 100%)",
                }}
              />

              <div className="flex items-center justify-end h-20 px-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-foreground hover:text-accent"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8">
                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 text-2xl font-medium text-foreground hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-4 text-base font-semibold rounded-full bg-gradient-to-r from-teal-deep to-teal text-accent-foreground hover:brightness-110"
                >
                  Get in Touch
                </Link>
              </div>
          </div>
        </>
      )}

      {/* Site-wide conversion CTAs (mobile bar + desktop WhatsApp float + AI concierge) */}
      <StickyMobileCTA />
      {/* <WhatsAppFloat /> */}
      <ChatWidget />
    </>
  );
}
