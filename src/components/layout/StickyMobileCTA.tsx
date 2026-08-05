"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

// Mobile-only sticky bottom bar with always-visible conversion CTAs.
// Mounted inside Navbar so it appears on every public page and stays off /admin.
export function StickyMobileCTA() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden"
    >
      {/* Teal hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--teal) 40%, transparent), transparent)",
        }}
      />
      <div
        className="bg-background/80 backdrop-blur-2xl border-t border-neutral-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center gap-3 px-4 pt-3 pb-3">
          <a
            href="/contact"
            className="flex-1 inline-flex items-center justify-center h-12 rounded-full bg-gradient-to-r from-teal-deep to-teal text-accent-foreground text-sm font-semibold hover:brightness-110 transition-all"
          >
            Book a Free Call
          </a>
          <a
            href={siteConfig.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="flex-shrink-0 w-12 h-12 rounded-full bg-whatsapp text-white flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
          >
            <WhatsAppIcon className="w-6 h-6" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
