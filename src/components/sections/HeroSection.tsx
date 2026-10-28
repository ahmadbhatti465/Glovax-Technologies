import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { HeroDashboardMockup } from "@/components/sections/HeroDashboardMockup";
import { HeroBacklight } from "@/components/sections/HeroBacklight";
import { HeroEmailCapture } from "@/components/sections/HeroEmailCapture";

const assurances = ["UK/US timezone overlap", "NDA on request", "24-hour response"];

/**
 * Server-rendered hero. The headline and subtitle (LCP) ship as static
 * HTML with no hydration cost; only the backlight, email capture and
 * product mockup are client islands.
 */
export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-canvas-base">
      {/* Layered backdrop: aurora wash → hairline tech grid → cursor backlight */}
      <div aria-hidden className="aurora absolute inset-0 -z-10" />
      <div aria-hidden className="tech-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-electricBright/50 to-transparent"
      />
      <HeroBacklight />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-36 pb-24 md:px-8 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement pill */}
          <Link
            href="/services"
            className="enter group mx-auto mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] py-1 pl-1 pr-3.5 text-xs text-brand-textSecondary backdrop-blur-sm transition-colors duration-200 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-brand-textPrimary"
          >
            <span className="rounded-full bg-gradient-to-r from-accent-electric to-accent-neon px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              New
            </span>
            Production AI agents &amp; RAG systems
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </Link>

          {/* Headline — LCP: rendered immediately, no entrance animation */}
          <h1 className="text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            <span className="text-premium">We turn your idea into an </span>
            <span className="text-signal">AI-powered product</span>
            <span className="text-premium"> that scales.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-textSecondary md:mt-8 md:text-lg">
            A senior software engineering team trusted by businesses worldwide. We ship AI-powered
            web, mobile and SaaS products in weeks, with transparent communication and long-term
            support.
          </p>

          <div className="enter mt-10 flex flex-wrap items-center justify-center gap-3" style={{ ["--d" as string]: "120ms" }}>
            <MagneticButton href="/contact" variant="primary" size="lg" withArrow>
              Book a free call
            </MagneticButton>
            <MagneticButton href="/work" variant="outline" size="lg">
              See our work
            </MagneticButton>
          </div>

          <ul
            className="enter mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-brand-textSecondary"
            style={{ ["--d" as string]: "200ms" }}
          >
            {assurances.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-accent-electricBright" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <div className="enter mt-10" style={{ ["--d" as string]: "280ms" }}>
            <HeroEmailCapture />
          </div>
        </div>
      </div>

      {/* Fade into the next section */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas-base" />
    </section>
  );
}
