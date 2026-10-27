import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

// Mobile-only sticky bottom bar with always-visible conversion CTAs.
// Mounted inside Navbar so it appears on every public page and stays off /admin.
export function StickyMobileCTA() {
  return (
    <div
      className="enter-rise fixed bottom-0 inset-x-0 z-30 lg:hidden"
      style={{ ["--d" as string]: "300ms" }}
    >
      <div aria-hidden className="hairline-lit absolute inset-x-0 top-0" />
      <div
        className="bg-canvas-base/80 backdrop-blur-xl border-t border-white/[0.06]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center gap-3 px-4 pt-3 pb-3">
          <Link
            href="/contact"
            className="flex-1 inline-flex items-center justify-center h-12 rounded-full bg-accent-electric text-white text-sm font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(37,99,235,0.6)] hover:bg-accent-electricBright transition-colors"
          >
            Book a free call
          </Link>
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
    </div>
  );
}
