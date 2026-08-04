"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

// Desktop-only floating WhatsApp button. Hidden on mobile (StickyMobileCTA covers it).
export function WhatsAppFloat() {
  return (
    <motion.a
      href={siteConfig.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-30 hidden lg:flex w-14 h-14 relative items-center justify-center rounded-full bg-whatsapp text-white shadow-lg hover:scale-105 transition-transform"
    >
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-30" />
      <WhatsAppIcon className="w-7 h-7 relative" />
    </motion.a>
  );
}
