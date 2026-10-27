import Link from "next/link";
import Image from "next/image";
import { siteConfig, footerLinks } from "@/lib/constants";
import { Linkedin, Instagram, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const socials = [
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
  { label: "Instagram", href: siteConfig.social.instagram, icon: Instagram },
  { label: "WhatsApp", href: siteConfig.social.whatsapp, icon: WhatsAppIcon },
];

const columns = [
  { title: "Company", links: footerLinks.company },
  { title: "Services", links: footerLinks.services },
  { title: "Resources", links: footerLinks.resources },
];

/** Server component — static markup, only the newsletter form hydrates. */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-canvas-base">
      <div aria-hidden className="hairline-lit absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:py-20 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex" aria-label="Glovax Technologies — home">
              <Image
                src="/images/glovax-logo.png"
                alt="Glovax Technologies"
                width={161}
                height={49}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-textSecondary">
              {siteConfig.description}
            </p>

            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-brand-textPrimary">Product &amp; AI insights, monthly</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
              <h3 className="mb-4 text-sm font-medium text-brand-textPrimary">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-textSecondary transition-colors duration-200 hover:text-brand-textPrimary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h3 className="mb-4 text-sm font-medium text-brand-textPrimary">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-brand-textSecondary transition-colors hover:text-brand-textPrimary"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-brand-textMuted" aria-hidden />
                  <span className="truncate">{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-2 text-brand-textSecondary transition-colors hover:text-brand-textPrimary"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-brand-textMuted" aria-hidden />
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2 text-brand-textSecondary">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-textMuted" aria-hidden />
                {siteConfig.address}
              </li>
              <li className="pt-1">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1 font-medium text-brand-textPrimary"
                >
                  Book a call
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-accent-electricBright transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-center justify-between gap-5 border-t border-white/[0.06] py-6 md:flex-row">
          <p className="text-xs text-brand-textMuted">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-brand-textMuted transition-colors hover:text-brand-textSecondary">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-brand-textMuted transition-colors hover:text-brand-textSecondary">
              Terms
            </Link>
            <span aria-hidden className="h-3 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-1">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${siteConfig.name} on ${label}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-textMuted transition-colors hover:bg-white/[0.04] hover:text-brand-textPrimary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Oversized wordmark — fades into the canvas */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] text-center font-heading text-[22vw] font-semibold leading-none tracking-[-0.06em] lg:text-[17rem] bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text text-transparent">
          GLOVAX
        </p>
      </div>

      {/* Reserve space on mobile so the sticky bottom CTA bar never covers the footer */}
      <div aria-hidden="true" className="h-28 lg:hidden" />
    </footer>
  );
}
