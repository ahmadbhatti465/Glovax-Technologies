"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { siteConfig, footerLinks } from "@/lib/constants";
import {
  ArrowUpRight,
  Linkedin,
  Instagram,
  Github,
  Briefcase,
  MessageCircle,
  Send,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
  upwork: <Briefcase className="w-4 h-4" />,
  whatsapp: <WhatsAppIcon className="w-4 h-4" />,
  twitter: <XIcon className="w-3.5 h-3.5" />,
};

// The socials we surface in the footer (in display order).
const footerSocials: (keyof typeof siteConfig.social)[] = [
  "linkedin",
  "github",
  "twitter",
  "instagram",
  "whatsapp",
];

function NewsletterBand() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to a real newsletter backend (e.g. Resend Audiences) before
    // launch. Front-end only for now — intentionally does not send anywhere.
    toast.success("Thanks for subscribing! We'll be in touch.");
    setEmail("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="py-12 md:py-14 border-t border-neutral-border"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="text-center lg:text-left">
          <h3 className="text-xl font-semibold tracking-tight">Product &amp; AI insights, monthly</h3>
          <p className="text-sm text-muted-foreground mt-1.5">
            One useful email a month on AI, SaaS, and shipping. No spam.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full lg:w-auto gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-label="Email address"
            className="w-full lg:w-72 px-4 py-3 rounded-full bg-card border border-neutral-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal/40 transition-colors"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-cta text-accent-foreground text-sm font-semibold hover:shadow-glow transition-all duration-300 flex-shrink-0 active:scale-[0.98]"
          >
            Subscribe <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function FooterColumn({
  title,
  links,
  delay = 0,
}: {
  title: string;
  links: { label: string; href: string }[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-5 tracking-wide">{title}</h3>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="link-underline text-sm text-muted-foreground hover:text-accent transition-colors duration-300 inline-flex items-center gap-1 group"
            >
              {link.label}
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-0.5 group-hover:translate-y-0" />
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-neutral-border">
      {/* Teal gradient top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--teal) 40%, transparent) 30%, color-mix(in srgb, var(--teal-bright) 50%, transparent) 50%, color-mix(in srgb, var(--teal) 40%, transparent) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Footer Content */}
        <div className="py-16 md:py-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3"
          >
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/glovax-logo.png"
                alt="Glovax Technologies"
                width={184}
                height={56}
                className="h-10 w-auto transition-all duration-500 group-hover:drop-shadow-[0_0_8px_var(--teal-glow)]"
              />
            </Link>
            <p className="mt-5 text-muted text-sm leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex items-center gap-2.5">
              {footerSocials.map((key) => {
                const url = siteConfig.social[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-card border border-neutral-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-teal/20 hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
                    aria-label={`Follow us on ${key}`}
                  >
                    {socialIcons[key] || key}
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Link Columns */}
          <div className="lg:col-span-2">
            <FooterColumn title="Company" links={footerLinks.company} delay={0.1} />
          </div>
          <div className="lg:col-span-3">
            <FooterColumn title="Services" links={footerLinks.services} delay={0.2} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Resources" links={footerLinks.resources} delay={0.3} />
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <h3 className="text-sm font-semibold text-foreground mb-5 tracking-wide">Contact</h3>
            <div className="space-y-3.5 text-sm">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2.5 text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                <Mail className="w-4 h-4 text-accent/70 flex-shrink-0" />
                <span className="truncate">{siteConfig.email}</span>
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-2.5 text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                <Phone className="w-4 h-4 text-accent/70 flex-shrink-0" />
                {siteConfig.phone}
              </a>
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4 text-accent/70 flex-shrink-0" />
                WhatsApp us
              </a>
              <p className="flex items-start gap-2.5 text-muted-foreground leading-relaxed">
                <MapPin className="w-4 h-4 text-accent/70 flex-shrink-0 mt-0.5" />
                {siteConfig.address}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-muted text-accent hover:border-teal/40 hover:shadow-glow transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                Book a call
              </a>
            </div>
          </motion.div>
        </div>

        {/* Newsletter */}
        <NewsletterBand />

        {/* Bottom Bar */}
        <div className="py-6 border-t border-neutral-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Reserve space on mobile so the sticky bottom CTA bar never covers the footer */}
      <div aria-hidden="true" className="h-28 lg:hidden" />
    </footer>
  );
}
